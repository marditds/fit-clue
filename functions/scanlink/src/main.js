import axios from 'axios';
import * as cheerio from 'cheerio';
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

    const domain = urlObj.hostname.replace(/^www\./, '');

    const blockedDomains = new Set([
      'localhost',
      '127.0.0.1',
      'example.internal',
      'malicious.com'
    ]);

    if (blockedDomains.has(domain)) {
      return res.json({
        success: false,
        message: 'Not a valid shopping link'
      });
    }

    try {
      const addresses = await dns.lookup(urlObj.hostname, { all: true });

      const isPrivateIP = (ip) =>
        ip.startsWith('10.') ||
        ip.startsWith('172.') ||
        ip.startsWith('192.168.') ||
        ip === '127.0.0.1' ||
        ip === '::1';

      if (addresses.some(a => isPrivateIP(a.address))) {
        return res.json({
          success: false,
          message: 'Not a valid shopping link'
        });
      }
    } catch (err) {
      log(`DNS error: ${err.message}`);
      return res.json({
        success: false,
        message: 'Failed to resolve domain'
      });
    }

    const shoppingDomains = new Set([
      'amazon.com',
      'ebay.com',
      'etsy.com',
      'walmart.com',
      'target.com',
      'nike.com',
      'zara.com'
    ]);

    const nonShoppingPlatforms = new Set([
      'x.com',
      'twitter.com',
      'youtube.com',
      'linkedin.com',
      'tiktok.com',
      'instagram.com'
    ]);

    let content = '';

    const isSpecialPlatform = nonShoppingPlatforms.has(domain);

    if (!isSpecialPlatform) {
      try {
        const response = await axios.get(link, {
          timeout: 7000,
          maxRedirects: 3,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
            'Accept': 'text/html'
          }
        });

        const $ = cheerio.load(response.data);

        const title = $('title').text() || '';
        const h1 = $('h1')
          .map((_, el) => $(el).text())
          .get()
          .join(' ');

        const paragraphs = $('p')
          .map((_, el) => $(el).text())
          .get()
          .slice(0, 10)
          .join(' ');

        content = `${title} ${h1} ${paragraphs}`.trim().slice(0, 8000);
      } catch (err) {
        log(`Fetch error: ${err.message}`);
        content = '';
      }
    }

    let score = 0;
    let reason = [];

    const text = content.toLowerCase();

    if (shoppingDomains.has(domain)) {
      score += 4;
      reason.push('known_shopping_domain');
    }

    if (nonShoppingPlatforms.has(domain)) {
      score -= 5;
      reason.push('non_shopping_platform');
    }

    const shoppingSignals = [
      { regex: /add to cart/i, weight: 2 },
      { regex: /buy now/i, weight: 2 },
      { regex: /checkout/i, weight: 2 },
      { regex: /\$\s?\d+/, weight: 2 },
      { regex: /shipping/i, weight: 1 },
      { regex: /product/i, weight: 1 }
    ];

    for (const signal of shoppingSignals) {
      if (signal.regex.test(text)) {
        score += signal.weight;
        reason.push(signal.regex.toString());
      }
    }

    const unsafePatterns = [
      /porn/i,
      /xxx/i,
      /nsfw/i,
      /sex/i,
      /nude/i,
      /fuck/i,
      /escort/i,
      /violence/i
    ];

    if (unsafePatterns.some(r => r.test(text))) {
      score -= 10;
      reason.push('unsafe_content_detected');
    }

    let verdict = 'review';

    if (score <= -5) {
      verdict = 'unsafe';
    } else if (score >= 4) {
      verdict = 'ok';
    } else if (score >= 1) {
      verdict = 'ok';
    } else {
      verdict = 'not_valid_shopping_link';
    }

    return res.json({
      success: true,
      message: verdict,
      debug: {
        domain,
        score,
        reason
      }
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