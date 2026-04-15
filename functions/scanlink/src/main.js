import dns from 'dns/promises';

// ======================================================
// 🧠 CONFIGURATION (EDIT ONLY THIS TO TUNE BEHAVIOR)
// ======================================================

const CONFIG = {
  // -------------------------
  // 🔒 Hard safety blocks
  // -------------------------
  blockedDomains: new Set([
    'localhost',
    '127.0.0.1',
    'example.internal'
  ]),

  unsafePatterns: [
    /porn/i,
    /xxx/i,
    /nsfw/i,
    /sex/i,
    /nude/i,
    /escort/i,
    /violence/i
  ],

  bannedTlds: [
    '.xxx',
    '.porn',
    '.adult',
    '.sex'
  ],

  // -------------------------
  // 🔵 Platform suppression
  // -------------------------
  nonShoppingPlatforms: new Set([
    'x.com',
    'twitter.com',
    'youtube.com',
    'instagram.com',
    'tiktok.com',
    'linkedin.com'
  ]),

  // -------------------------
  // 🟢 Commerce signal weights
  // (THIS is the core system)
  // -------------------------
  signals: {
    strong: {
      productPath: 5,
      skuOrProductId: 4,
      checkoutPath: 4,
      priceInUrl: 3       // FIX #1: now tested against decoded URL
    },

    medium: {
      shopKeyword: 2,
      storeKeyword: 2,
      boutiqueKeyword: 2,
      affiliatePattern: 2
    },

    weak: {
      editorialCommerceHint: 2,
      slugProductPath: 1  // FIX #4: new signal for slug-style product URLs
    },

    boosts: {
      trustedRetailer: 2
    }
  },

  // -------------------------
  // 🎯 Decision thresholds
  // -------------------------
  thresholds: {
    allow: 5,
    review: 2
  },

  // -------------------------
  // ⏱ DNS timeout (ms)
  // -------------------------
  dnsTimeoutMs: 3000      // FIX #6: DNS lookup timeout
};

// ======================================================
// 🧠 HELPERS
// ======================================================

const normalizeUrl = (url) => {
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
};

// FIX #5: Added missing SSRF-relevant ranges (169.254.x.x, 0.x.x.x, 100.64.x.x)
const isPrivateIP = (ip) => {
  if (!ip) return false;

  if (ip === '0.0.0.0') return true;
  if (ip.startsWith('0.')) return true;
  if (ip.startsWith('10.')) return true;
  if (ip.startsWith('127.')) return true;
  if (ip.startsWith('192.168.')) return true;

  // Link-local — includes the AWS EC2 metadata endpoint (169.254.169.254)
  if (ip.startsWith('169.254.')) return true;

  // CGNAT / shared address space
  if (ip.startsWith('100.')) {
    const second = Number(ip.split('.')[1]);
    if (second >= 64 && second <= 127) return true;
  }

  if (ip.startsWith('172.')) {
    const second = Number(ip.split('.')[1]);
    if (second >= 16 && second <= 31) return true;
  }

  // IPv6 loopback and ULA
  if (ip === '::1' || ip.startsWith('fc') || ip.startsWith('fd')) {
    return true;
  }

  return false;
};

const isPlatform = (domain) =>
  [...CONFIG.nonShoppingPlatforms].some(d =>
    domain === d || domain.endsWith(`.${d}`)
  );

// FIX #6: Wraps dns.lookup with a configurable timeout to prevent function hangs
const dnsLookupWithTimeout = (hostname, timeoutMs) => {
  return Promise.race([
    dns.lookup(hostname, { all: true }),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`DNS lookup timed out after ${timeoutMs}ms`)),
        timeoutMs
      )
    )
  ]);
};

// ======================================================
// 🧠 MAIN FUNCTION
// ======================================================

export default async ({ req, res, log, error }) => {
  try {
    const body = typeof req.body === 'string'
      ? JSON.parse(req.body)
      : req.body;

    const rawLink = body?.link;

    if (!rawLink) {
      return res.json({
        success: false,
        message: 'Missing link'
      });
    }

    const link = normalizeUrl(rawLink);

    let urlObj;

    try {
      urlObj = new URL(link);
    } catch {
      return res.json({
        success: false,
        message: 'Invalid URL'
      });
    }

    const domain = urlObj.hostname.replace(/^www\./, '').toLowerCase();

    // FIX #1: Decode the URL once up front so all signal checks work against
    // the human-readable form (e.g. %24 → $, %2F → /, etc.)
    const decodedLink = (() => {
      try {
        return decodeURIComponent(link);
      } catch {
        return link; // fall back to raw if decoding fails (malformed encoding)
      }
    })();

    // ======================================================
    // 🔒 TIER 1 — SAFETY BLOCK (HARD STOP)
    // ======================================================

    if (CONFIG.blockedDomains.has(domain)) {
      return res.json({ success: true, message: 'unsafe' });
    }

    if (CONFIG.bannedTlds.some(tld => domain.endsWith(tld))) {
      return res.json({ success: true, message: 'unsafe' });
    }

    if (CONFIG.unsafePatterns.some(r => r.test(link))) {
      return res.json({ success: true, message: 'unsafe' });
    }

    // DNS / SSRF protection
    try {
      // FIX #6: Use timeout-wrapped DNS lookup instead of bare dns.lookup
      const addresses = await dnsLookupWithTimeout(
        urlObj.hostname,
        CONFIG.dnsTimeoutMs
      );

      if (addresses.some(a => isPrivateIP(a.address))) {
        return res.json({ success: true, message: 'unsafe' });
      }
    } catch (err) {
      log(`DNS error: ${err.message}`);
      return res.json({
        success: false,
        message: 'Failed to resolve domain'
      });
    }

    // ======================================================
    // 🧠 TIER 2 — PLATFORM SUPPRESSION
    // ======================================================

    if (isPlatform(domain)) {
      return res.json({
        success: true,
        message: 'not_valid_shopping_link'
      });
    }

    // ======================================================
    // 🟣 SCORING ENGINE — COMMERCE INTENT
    // ======================================================

    let score = 0;
    const path = urlObj.pathname.toLowerCase();
    const query = urlObj.searchParams;

    // -------------------------
    // 🟢 Strong signals
    // -------------------------
    if (/\/product\/|\/p\/|\/item\/|\/dp\/|\/gp\/product\//i.test(path)) {
      score += CONFIG.signals.strong.productPath;
    }

    if (query.has('sku') || query.has('product_id') || query.has('item')) {
      score += CONFIG.signals.strong.skuOrProductId;
    }

    if (/checkout|cart|buy/i.test(path)) {
      score += CONFIG.signals.strong.checkoutPath;
    }

    // FIX #1: Test the decoded URL so percent-encoded "$" (%24) is caught
    if (/\$\s?\d+/.test(decodedLink)) {
      score += CONFIG.signals.strong.priceInUrl;
    }

    // -------------------------
    // 🟡 Medium signals
    // -------------------------
    if (domain.includes('shop')) score += CONFIG.signals.medium.shopKeyword;
    if (domain.includes('store')) score += CONFIG.signals.medium.storeKeyword;
    if (domain.includes('boutique')) score += CONFIG.signals.medium.boutiqueKeyword;

    if (/ref=|affiliate|utm_/i.test(link)) {
      score += CONFIG.signals.medium.affiliatePattern;
    }

    // -------------------------
    // 🟣 Weak editorial commerce signals
    // (important for Farfetch / Editorialist type sites)
    // -------------------------

    // FIX #2: Removed `query.toString().length > 0` — it matched any URL with
    // any query param (e.g. ?lang=en), causing false positives on non-commerce sites.
    // Only fire on explicit commerce-flavored path keywords now.
    const looksLikeEditorialCommerce =
      path.length > 10 &&
      (path.includes('fashion') ||
        path.includes('style') ||
        path.includes('designer') ||
        path.includes('shop'));

    if (looksLikeEditorialCommerce) {
      score += CONFIG.signals.weak.editorialCommerceHint;
    }

    // FIX #4: Slug-style product URL weak signal
    // Catches paths like /t/air-max-270-react or /en/clothing/blue-dress-12345
    // that major retailers (Nike, Zara, ASOS, H&M, etc.) commonly use.
    // Two or more dash-separated slug segments = weak commerce hint.
    const slugSegments = path.split('/').filter(s => /^[a-z0-9][a-z0-9-]{2,}$/.test(s));
    if (slugSegments.length >= 2) {
      score += CONFIG.signals.weak.slugProductPath;
    }

    // -------------------------
    // 🟢 Trusted domain boost (optional, not required)
    // -------------------------
    const trustedBoostDomains = new Set([
      'amazon.com',
      'ebay.com',
      'etsy.com',
      'walmart.com',
      'target.com',
      'macys.com',
      'farfetch.com',
      'editorialist.com',
      'ssense.com',
      // FIX #4: Added widely-used retailers missing from original list
      'nike.com',
      'asos.com',
      'zara.com',
      'hm.com',
      'nordstrom.com',
      'zappos.com',
      'gap.com',
      'uniqlo.com',
      'adidas.com',
      'newbalance.com'
    ]);

    if ([...trustedBoostDomains].some(d =>
      domain === d || domain.endsWith(`.${d}`)
    )) {
      score += CONFIG.signals.boosts.trustedRetailer;
    }

    // ======================================================
    // 🎯 FINAL DECISION ENGINE
    //
    // FIX #3: 'review' is now treated as a rejection ('not_valid_shopping_link')
    // because there is no moderation queue in this app. If you add one later,
    // restore the 'review' verdict and route it to your queue instead.
    // ======================================================

    let verdict;

    if (score >= CONFIG.thresholds.allow) {
      verdict = 'ok';
    } else {
      // Both 'review' and sub-threshold scores are rejected at the gate.
      // Change this to `verdict = 'review'` if you add a moderation queue.
      verdict = 'not_valid_shopping_link';
    }

    log(JSON.stringify({
      domain,
      score,
      verdict
    }, null, 2));

    return res.json({
      success: true,
      message: verdict
    });

  } catch (err) {
    error(`Unhandled error: ${err.message}`);

    return res.json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};