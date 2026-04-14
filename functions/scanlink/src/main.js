import axios from 'axios';
import * as cheerio from 'cheerio';
import dns from 'dns/promises';

export default async ({ req, res, log, error }) => {
  try {
    log('A: function start');
    const body = typeof req.body === 'string'
      ? JSON.parse(req.body)
      : req.body;

    log(body)

    const rawLink = body?.link;

    log('B: after body parse');
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

    log('C: after URL parse');

    const link = normalizeUrl(rawLink);

    log(' after normalized URL');

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

    log('after blockedDomains check');

    try {
      log('start dns.lookup');

      const addresses = await dns.lookup(urlObj.hostname, { all: true });

      const ipList = addresses
        .map(a => a?.address)
        .filter(ip => typeof ip === 'string' && ip.length > 0);

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

      const privateIps = ipList.filter(isPrivateIP);

      log('Private IPs detected');

      if (privateIps.length > 0) {
        return res.json({
          success: false,
          message: 'Not a valid shopping link'
        });
      }

      log('E: DNS check passed');

    } catch (err) {
      log(`DNS error: ${err.message}`);

      return res.json({
        success: false,
        message: 'Failed to resolve domain'
      });
    }

    log('E: after DNS');

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

    log('G: after axios');

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

    log('H: before scoring');

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

    log(JSON.stringify({
      success: true,
      message: verdict,
      debug: {
        domain,
        score,
        reason
      }
    }, null, 2));

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