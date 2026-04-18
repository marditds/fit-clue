import dns from 'dns/promises';
import { Client, Account, Users, TablesDB, ID } from 'node-appwrite';

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

  // Quick raw-URL check. Kept as a first-pass defense in depth.
  // The comprehensive adult check (isAdultContent) runs separately below
  // and covers obfuscated/leet-encoded variants of these same terms.
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
  // 🔞 Adult content detection
  // (two-layer: keyword list + obfuscation patterns)
  // -------------------------

  // Checked against the leet-NORMALIZED domain + path.
  // Catches: p0rn → porn, s3x → sex, 0nlyfans → onlyfans, etc.
  adultKeywords: [
    // Core explicit terms
    'porn', 'sex', 'xxx', 'nude', 'naked', 'nsfw', 'erotic',
    'escort', 'hentai', 'fetish', 'bdsm', 'milf', 'dilf', 'onlyfans',
    // Explicit acts/anatomy — only realistic at domain/path level in adult contexts
    'cumshot', 'gangbang', 'hardcore',
    // Known adult platforms (also catches leet variants after normalization)
    'pornhub', 'xvideos', 'xnxx', 'brazzers', 'bangbros',
    'redtube', 'youporn', 'spankbang', 'xhamster', 'chaturbate',
    'livejasmin', 'stripchat', 'myfreecams',
  ],

  // Checked on BOTH the raw string and the leet-normalized string.
  // Catches disguised terms that digit-only normalization can't fully resolve:
  //   cornhub  → /cornhub/i
  //   pr0n     → /pr[o0]n/i
  //   p-o-r-n  → /p[\W_]?o[\W_]?r[\W_]?n/i
  //   x.x.x    → /x[\W_]?x[\W_]?x/i
  //   wh0re    → /wh[\W_]?[o0][\W_]?r[\W_]?e/i
  //   etc.
  adultObfuscationPatterns: [
    // Brand obfuscations (letter swap: p ↔ c/k)
    /cornhub/i,
    /kornhub/i,
    // Separated or digit-substituted core terms
    /pr[o0]n/i,                               // pron, pr0n
    /p[\W_]?o[\W_]?r[\W_]?n/i,               // p-o-r-n, p.o.r.n
    /n[\W_]?u[\W_]?d[\W_]?e/i,               // n-u-d-e
    /s[\W_]?e[\W_]?x/i,                       // s-e-x, s.e.x
    /x[\W_]?x[\W_]?x/i,                       // x-x-x, x.x.x
    /h[\W_]?e[\W_]?n[\W_]?t[\W_]?a[\W_]?i/i, // h-e-n-t-a-i
    /er[\W_]?[o0][\W_]?t[\W_]?[i1][\W_]?c/i, // er0t1c, er-o-t-i-c
    /wh[\W_]?[o0][\W_]?r[\W_]?e/i,           // wh0re, wh-o-r-e
    /sl[\W_]?[u4][\W_]?t/i,                   // sl4t, sl-u-t
    /h[\W_]?[o0][\W_]?r[\W_]?n[\W_]?[yi]/i,  // h0rny, h-o-r-n-y
    /f[\W_]?[u4][\W_]?c[\W_]?k/i,            // f4ck, f-u-c-k
    /ph[\W_]?[u4][\W_]?c[\W_]?k/i,           // phuck, ph4ck
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
  // -------------------------
  signals: {
    strong: {
      productPath: 5,
      skuOrProductId: 4,
      checkoutPath: 4,
      priceInUrl: 3       // Tested against decoded URL
    },
    medium: {
      shopKeyword: 2,
      storeKeyword: 2,
      boutiqueKeyword: 2,
      affiliatePattern: 2
    },
    weak: {
      editorialCommerceHint: 2,
      slugProductPath: 1  // Slug-style product paths e.g. /t/air-max-270
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
  dnsTimeoutMs: 3000
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

// Covers all private/reserved ranges including
// 169.254.x.x (AWS metadata), 0.x.x.x, and CGNAT 100.64–127.x.x
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

// Prevents function hangs if DNS is unresponsive
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

// Reverses common leet-speak substitutions used to disguise adult content.
// Digits and symbols ONLY — intentionally no letter-to-letter substitutions
// (e.g. no c→p rule) to prevent turning innocent words like "cornerstone"
// into false positives. The adultObfuscationPatterns list handles
// letter-swap obfuscations like cornhub explicitly instead.
const normalizeLeet = (str) => str
  .toLowerCase()
  .replace(/0/g, 'o')
  .replace(/1/g, 'i')
  .replace(/3/g, 'e')
  .replace(/4/g, 'a')
  .replace(/5/g, 's')
  .replace(/7/g, 't')
  .replace(/8/g, 'b')
  .replace(/\$/g, 's')
  .replace(/@/g, 'a')
  .replace(/!/g, 'i')
  .replace(/ph/g, 'f');

// Three-layer adult content check:
//   Layer 1 — Keyword match on leet-normalized string
//             Catches: p0rn→porn, s3x→sex, 0nlyfans→onlyfans
//   Layer 2 — Obfuscation patterns on raw string
//             Catches: cornhub, pr0n, p-o-r-n, x.x.x, wh0re
//   Layer 3 — Obfuscation patterns on normalized string
//             Catches: mixed obfuscations like c0rnhub (0→o first, then /cornhub/)
const isAdultContent = (domain, path) => {
  const rawTarget = `${domain}${path}`;
  const normalizedTarget = normalizeLeet(rawTarget);

  // Layer 1: keyword match on normalized string
  if (CONFIG.adultKeywords.some(kw => normalizedTarget.includes(kw))) return true;

  // Layers 2 & 3: obfuscation patterns on both raw and normalized
  if (CONFIG.adultObfuscationPatterns.some(p => p.test(rawTarget))) return true;
  if (CONFIG.adultObfuscationPatterns.some(p => p.test(normalizedTarget))) return true;

  return false;
};

// ======================================================
// 🧠 MAIN FUNCTION
// ======================================================

export default async ({ req, res, log, error }) => {

  const client = new Client()
    .setEndpoint(process.env.API_ENDPOINT)
    .setProject(process.env.PROJECT_ID)

  const account = new Account(client);

  try {
    const user = await account.get();
    console.log('Logged in user:', user);
  } catch (e) {
    console.log('NOT LOGGED IN');
  }

  const tablesDB = new TablesDB(client);

  const dbEnv = process.env.DATABASE_ID;
  const linksCollEnv = process.env.LINKS_COLLECTION;

  try {

    const user = await account.get();

    if (!user) {
      return res.json({
        saccess: false,
        message: 'not_a_valid_user'
      });
    }

    const body = typeof req.body === 'string'
      ? JSON.parse(req.body)
      : req.body;

    const rawLink = body?.href;

    const assessmentRes = '';

    if (!rawLink) {
      log('missing_link');
      return res.json({
        success: false,
        message: 'missing_link'
      });
    }

    const link = normalizeUrl(rawLink);

    let urlObj;
    try {
      urlObj = new URL(link);
    } catch {
      log('invalid_url');
      return res.json({
        success: false,
        message: 'invalid_url'
      });
    }

    const domain = urlObj.hostname.replace(/^www\./, '').toLowerCase();

    // Decode once up front so all signal checks work against
    // the human-readable form (e.g. %24 → $, %2F → /)
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
      log(JSON.stringify({ domain, verdict: 'unsafe' }, null, 2))
      return res.json({ success: true, message: 'unsafe' });
    }

    if (CONFIG.bannedTlds.some(tld => domain.endsWith(tld))) {
      log(JSON.stringify({ domain, verdict: 'unsafe' }, null, 2))
      return res.json({ success: true, message: 'unsafe' });
    }

    // Quick raw-string check (first-pass, defense in depth)
    if (CONFIG.unsafePatterns.some(r => r.test(link))) {
      log(JSON.stringify({ domain, verdict: 'unsafe' }, null, 2))
      return res.json({ success: true, message: 'unsafe' });
    }

    // Comprehensive adult content check:
    // covers leet-speak, character substitution, separator insertion,
    // and known obfuscated brand names (cornhub, pr0n, x-x-x, wh0re, etc.)
    if (isAdultContent(domain, urlObj.pathname)) {
      log(JSON.stringify({ domain, verdict: 'unsafe' }, null, 2))
      return res.json({ success: true, message: 'unsafe' });
    }

    // DNS / SSRF protection
    try {
      // timeout-wrapped lookup prevents function hangs
      const addresses = await dnsLookupWithTimeout(
        urlObj.hostname,
        CONFIG.dnsTimeoutMs
      );

      if (addresses.some(a => isPrivateIP(a.address))) {
        log(JSON.stringify({ domain, verdict: 'unsafe' }, null, 2))
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
    if (/\/products?\/|\/p\/|\/item\/|\/dp\/|\/gp\/product\//i.test(path)) {
      score += CONFIG.signals.strong.productPath;
    }

    if (query.has('sku') || query.has('product_id') || query.has('item')) {
      score += CONFIG.signals.strong.skuOrProductId;
    }

    if (/checkout|cart|buy/i.test(path)) {
      score += CONFIG.signals.strong.checkoutPath;
    }

    // test decoded URL so percent-encoded "$" (%24) is caught
    if (/\$\s?\d+/.test(decodedLink)) {
      score += CONFIG.signals.strong.priceInUrl;
    }

    // -------------------------
    // 🟡 Medium signals
    // -------------------------
    if (domain.includes('shop')) score += CONFIG.signals.medium.shopKeyword;
    if (domain.includes('store')) score += CONFIG.signals.medium.storeKeyword;
    if (domain.includes('boutique')) score += CONFIG.signals.medium.boutiqueKeyword;

    if (/\/shop\//i.test(path)) score += CONFIG.signals.medium.shopKeyword;

    if (/ref=|affiliate|utm_/i.test(link)) {
      score += CONFIG.signals.medium.affiliatePattern;
    }

    // -------------------------
    // 🟣 Weak editorial commerce signals
    // -------------------------
    const looksLikeEditorialCommerce =
      path.length > 10 &&
      (path.includes('fashion') ||
        path.includes('style') ||
        path.includes('designer') ||
        path.includes('shop'));

    if (looksLikeEditorialCommerce) {
      score += CONFIG.signals.weak.editorialCommerceHint;
    }

    // Catches paths like /t/air-max-270-react or /en/clothing/blue-dress-12345
    // that major retailers (Nike, Zara, ASOS, H&M, etc.) commonly use.
    const slugSegments = path
      .split('/')
      .map(s => s.replace(/\.[a-z]{2,4}$/, ''))     // strip file extensions
      .filter(s => /^[a-z0-9][a-z0-9-]{1,}$/.test(s)); // min 2 chars
    if (slugSegments.length >= 2) {
      score += CONFIG.signals.weak.slugProductPath;
    }

    // Zara-style embedded product IDs e.g. /washed-polo-p06987435.html
    if (/-p\d{5,}/i.test(path)) {
      score += CONFIG.signals.strong.productPath;
    }

    // Flat root-level product slugs used by small boutiques and independent stores
    // e.g. /strapless-embroidered-floral-dress-yellow/
    // Requires: single path segment + 3+ hyphenated parts + known product term
    const fashionTerms = /\b(dress|shirt|pants|jeans|jacket|blouse|skirt|sweater|hoodie|coat|shorts|suit|boots|shoes|sneakers|sandals|top|leggings?|cardigan|blazer|bag|handbag|purse|wallet|belt|hat|cap|scarf|gloves|sunglasses|necklace|bracelet|earrings?|ring|watch|tee|polo|sweatshirt|vest|romper|jumpsuit|bikini|swimsuit|socks|denim)\b/i;

    const pathSegments = path.split('/').filter(Boolean);
    const isFlatProductSlug =
      pathSegments.length === 1 &&
      pathSegments[0].split('-').length >= 3 &&
      fashionTerms.test(pathSegments[0]);

    if (isFlatProductSlug) {
      score += CONFIG.signals.strong.productPath; // +5
    }

    // -------------------------
    // 🟢 Trusted domain boost
    // -------------------------
    const trustedBoostDomains = new Set([
      'amazon.com',
      'ebay.com',
      'etsy.com',
      'walmart.com',
      'target.com',
      'macys.com',
      'jcpenney.com',
      'bloomingdales.com',
      'neimanmarcus.com',
      'saksfifthavenue.com',
      'poshmark.com',
      'farfetch.com',
      'editorialist.com',
      'ssense.com',
      'nike.com',
      'asos.com',
      'zara.com',
      'hm.com',
      'anthropologie.com',
      'urbanoutfitters.com',
      'freepeople.com',
      'ralphlauren.com',
      'coach.com',
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
    // 'review' is treated as a rejection because there is no
    // moderation queue.
    // ======================================================

    const verdict = score >= CONFIG.thresholds.allow
      ? 'ok'
      : 'not_valid_shopping_link';

    log(JSON.stringify({ domain, score, verdict }, null, 2));

    // ======================================================
    // ✍ WRITE TO THE DATABASE
    // ======================================================

    // let newLink = {};

    if (verdict === 'ok') {
      const newLink = await tablesDB.createRow({
        databaseId: dbEnv,
        tableId: linksCollEnv,
        rowId: ID.unique(),
        data: {
          href: body.href,
          brand_name: body.brandName,
          item: body.item,
          user_id: user.$id,
          similarity_level: body.similarityLevel
        }
      })
      return res.json({
        success: true,
        domain: domain,
        message: verdict,
        newLinkId: newLink.$id
      });
    } else {
      return res.json({
        success: true,
        domain: domain,
        message: verdict,
      });
    }

  } catch (err) {
    error(`Unhandled error: ${err.message}`);

    return res.json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};