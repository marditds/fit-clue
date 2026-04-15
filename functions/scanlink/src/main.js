import dns from 'dns/promises';

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

    const normalizeUrl = (url) => {
      if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
      }
      return url;
    };

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

    const blockedDomains = new Set([
      'localhost',
      '127.0.0.1',
      'example.internal'
    ]);

    const bannedTlds = ['.xxx', '.porn', '.adult', '.sex'];

    const unsafePatterns = [
      /porn/i,
      /xxx/i,
      /nsfw/i,
      /sex/i,
      /fuck/i,
      /nude/i,
      /escort/i
    ];

    if (blockedDomains.has(domain)) {
      return res.json({ success: true, message: 'unsafe' });
    }

    if (bannedTlds.some(tld => domain.endsWith(tld))) {
      return res.json({ success: true, message: 'unsafe' });
    }

    if (unsafePatterns.some(r => r.test(link))) {
      return res.json({ success: true, message: 'unsafe' });
    }

    try {
      const addresses = await dns.lookup(urlObj.hostname, { all: true });

      const isPrivateIP = (ip) => {
        if (!ip) return false;

        if (ip.startsWith('10.')) return true;
        if (ip.startsWith('192.168.')) return true;
        if (ip.startsWith('127.')) return true;

        if (ip.startsWith('172.')) {
          const second = Number(ip.split('.')[1]);
          if (second >= 16 && second <= 31) return true;
        }

        if (
          ip === '::1' ||
          ip.startsWith('fc') ||
          ip.startsWith('fd')
        ) {
          return true;
        }

        return false;
      };

      const privateIpFound = addresses.some(a => isPrivateIP(a.address));

      if (privateIpFound) {
        return res.json({ success: true, message: 'unsafe' });
      }

    } catch (err) {
      log(`DNS error: ${err.message}`);

      return res.json({
        success: false,
        message: 'Failed to resolve domain'
      });
    }

    const trustedRetailers = new Set([
      'amazon.com',
      'ebay.com',
      'etsy.com',
      'walmart.com',
      'target.com',
      'nike.com',
      'zara.com',
      'macys.com',
      'bestbuy.com',
      'asos.com',
      'hm.com'
    ]);

    const isTrustedDomain = (domain) =>
      [...trustedRetailers].some(d =>
        domain === d || domain.endsWith(`.${d}`)
      );

    if (isTrustedDomain(domain)) {
      log(`ALLOW: trusted domain (${domain})`);
      return res.json({ success: true, message: 'ok' });
    }

    const nonShoppingPlatforms = new Set([
      'x.com',
      'twitter.com',
      'youtube.com',
      'instagram.com',
      'tiktok.com',
      'linkedin.com'
    ]);

    const isPlatform = (domain) =>
      [...nonShoppingPlatforms].some(d =>
        domain === d || domain.endsWith(`.${d}`)
      );

    if (isPlatform(domain)) {
      log(`REJECT: non-shopping platform (${domain})`);
      return res.json({
        success: true,
        message: 'not_valid_shopping_link'
      });
    }

    const productPatterns = [
      /\/product\//i,
      /\/p\//i,
      /\/item\//i,
      /\/dp\//i,
      /\/gp\/product\//i,
      /\/shop\//i
    ];

    const querySignals = [
      'product_id',
      'sku',
      'item',
      'variant'
    ];

    const hasProductPath = productPatterns.some(r =>
      r.test(urlObj.pathname)
    );

    const hasProductQuery = querySignals.some(param =>
      urlObj.searchParams.has(param)
    );

    if (hasProductPath || hasProductQuery) {
      log(`ALLOW: structural shopping signal (${link})`);
      return res.json({ success: true, message: 'ok' });
    }

    const domainSignals = ['shop', 'store', 'boutique'];

    const looksLikeStore = domainSignals.some(s =>
      domain.includes(s)
    );

    if (looksLikeStore) {
      log(`REVIEW: heuristic match (${domain})`);
      return res.json({
        success: true,
        message: 'review'
      });
    }

    log(`REJECT: no shopping signals (${link})`);

    return res.json({
      success: true,
      message: 'not_valid_shopping_link'
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