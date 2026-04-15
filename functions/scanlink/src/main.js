import dns from 'dns/promises';
import { Client, TablesDB, ID, Query } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.ENDPOINT)
  .setProject(process.env.PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const db = new TablesDB(client);

const DATABASE_ID = process.env.DATABASE_ID;
const REVIEWS_LINKS_COLLECTION = process.env.REVIEWS_LINKS_COLLECTION;
const LEARNING_LINKS_COLLECTION = process.env.LEARNING_LINKS_COLLECTION;

const CONFIG = {
  blockedDomains: new Set(['localhost', '127.0.0.1']),
  unsafePatterns: [/porn/i, /xxx/i, /sex/i, /nude/i],
  nonShoppingPlatforms: new Set([
    'x.com',
    'twitter.com',
    'youtube.com',
    'instagram.com',
    'tiktok.com',
    'linkedin.com'
  ])
};

const normalizeUrl = (url) =>
  /^https?:\/\//i.test(url) ? url : `https://${url}`;

const isPrivateIP = (ip) =>
  ip.startsWith('10.') ||
  ip.startsWith('192.168.') ||
  ip.startsWith('127.') ||
  ip === '::1' ||
  ip.startsWith('fc') ||
  ip.startsWith('fd');

const isPlatform = (domain) =>
  [...CONFIG.nonShoppingPlatforms].some(
    d => domain === d || domain.endsWith(`.${d}`)
  );

async function getDomainTrust(domain) {
  try {
    const result = await db.listRows({
      databaseId: DATABASE_ID,
      tableId: LEARNING_LINKS_COLLECTION,
      queries: [Query.equal('domain', domain)]
    });

    if (result.rows.length === 0) {
      return 0.5;
    }

    return result.rows[0].trustScore;
  } catch {
    return 0.5;
  }
}

async function updateDomainLearning(domain, verdict) {
  try {
    const existing = await db.listRows({
      databaseId: DATABASE_ID,
      tableId: LEARNING_LINKS_COLLECTION,
      queries: [Query.equal('domain', domain)]
    });

    let doc = existing.rows[0];

    if (!doc) {
      await db.createRow({
        databaseId: DATABASE_ID,
        tableId: LEARNING_LINKS_COLLECTION,
        rowId: ID.unique(),
        data: {
          domain,
          approvedCount: verdict === 'ok' ? 1 : 0,
          rejectedCount: verdict === 'ok' ? 0 : 1,
          trustScore: verdict === 'ok' ? 0.6 : 0.4,
        }
      });
      return;
    }

    const approved = doc.approvedCount + (verdict === 'ok' ? 1 : 0);
    const rejected = doc.rejectedCount + (verdict !== 'ok' ? 1 : 0);

    const trustScore = approved / (approved + rejected);

    await db.updateRow({
      databaseId: DATABASE_ID,
      tableId: LEARNING_LINKS_COLLECTION,
      rowId: doc.$id,
      data: {
        approvedCount: approved,
        rejectedCount: rejected,
        trustScore,
      }
    });
  } catch (err) {
    console.error('Learning update failed:', err.message);
  }
}

export default async ({ req, res, log, error }) => {
  try {
    const body = typeof req.body === 'string'
      ? JSON.parse(req.body)
      : req.body;

    const rawLink = body?.link;

    if (!rawLink) {
      return res.json({ success: false, message: 'Missing link' });
    }

    const link = normalizeUrl(rawLink);
    const urlObj = new URL(link);
    const domain = urlObj.hostname.replace(/^www\./, '');

    if (CONFIG.blockedDomains.has(domain)) {
      return res.json({ success: true, message: 'unsafe' });
    }

    if (CONFIG.unsafePatterns.some(r => r.test(link))) {
      return res.json({ success: true, message: 'unsafe' });
    }

    const addresses = await dns.lookup(urlObj.hostname, { all: true });

    if (addresses.some(a => isPrivateIP(a.address))) {
      return res.json({ success: true, message: 'unsafe' });
    }

    if (isPlatform(domain)) {
      return res.json({
        success: true,
        message: 'not_valid_shopping_link'
      });
    }

    const trust = await getDomainTrust(domain);

    let score = 0;

    const path = urlObj.pathname.toLowerCase();

    if (/\/product\/|\/p\/|\/item\/|\/dp\//i.test(path)) score += 5;
    if (domain.includes('shop')) score += 2;
    if (domain.includes('store')) score += 2;
    if (/\$\s?\d+/.test(link)) score += 2;

    score += trust * 3; // adaptive boost

    let verdict = 'not_valid_shopping_link';

    if (score >= 5) verdict = 'ok';
    else if (score >= 2) verdict = 'review';

    log(`${link}, ${domain}, ${score}, ${verdict}`)

    const reviewDoc = await db.createRow({
      databaseId: DATABASE_ID,
      tableId: REVIEWS_LINKS_COLLECTION,
      rowId: ID.unique(),
      data: {
        link,
        domain,
        score,
        verdict,
        resolved: false
      }
    });

    log(`Stored review: ${reviewDoc.$id}`);

    await updateDomainLearning(domain, verdict);

    return res.json({
      success: true,
      message: verdict
    });

  } catch (err) {
    error(err.message);

    return res.json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};