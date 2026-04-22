import { Filter } from 'bad-words';
import { Client, Account, TablesDB, ID } from 'node-appwrite';

// ── Blocklists ──────────────────────────────────────────────────────────────
const HARASSMENT_TERMS = [
  'kill yourself', 'kys', 'go die', 'i hope you die', 'you should die',
  'nobody likes you', 'worthless', 'you are pathetic', 'ur pathetic',
  'loser', 'idiot', 'moron', 'imbecile', 'retard', 'retarded',
  'shut up', 'stfu', 'get lost', 'drop dead',
];

const HATE_SPEECH_TERMS = [
  'nazi', 'white power', 'white supremacy', 'racial slur examples here'
];

const SPAM_PHRASES = [
  'click here', 'buy now', 'limited offer', 'act now', 'free money',
  'make money fast', 'work from home', 'earn per day', 'dm me', 'dm for',
  'follow me', 'check my profile', 'check my bio', 'subscribe to',
  'visit my', 'check out my', 'link in bio', 'link in my bio',
  'whatsapp me', 'telegram me', 'contact me at', 'reach me at',
];

// ── Regex Patterns ──────────────────────────────────────────────────────────

// Catches: http(s)://, www., and disguised variants like "www dot x dot com"
const URL_PATTERNS = [
  /https?:\/\/[^\s]+/i,
  /www\.[a-z0-9\-]+\.[a-z]{2,}/i,
  /\bwww\s*(dot|\[\.?\]|\.)\s*[a-z0-9\-]+\s*(dot|\[\.?\]|\.)\s*[a-z]{2,}\b/i,
  /[a-z0-9\-]+\.(com|net|org|io|co|gg|me|tv|xyz|info|biz|app|dev)\b/i,
];

// ── Helpers ─────────────────────────────────────────────────────────────────

function containsAny(text, terms) {
  const lower = text.toLowerCase();
  return terms.find(term => lower.includes(term.toLowerCase())) ?? null;
}

function checkUrls(text) {
  return URL_PATTERNS.find(p => p.test(text)) ? true : false;
}

const variations = (text) => {
  return text
    .toLowerCase()
    .replace(/\b(\w[.\s_-]){2,}\w\b/g, match => match.replace(/[.\s_-]/g, ''))
    .replace(/[@4]/g, 'a')
    .replace(/3/g, 'e')
    .replace(/[1!|]/g, 'i')
    .replace(/0/g, 'o')
    .replace(/[$5]/g, 's')
    .replace(/7/g, 't')
    .replace(/[*]/g, '')
    .replace(/[-–—_]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// ── Main export ─────────────────────────────────────────────────────────────

export default async ({ req, res, log, error }) => {

  const client = new Client()
    .setEndpoint(process.env.ENDPOINT)
    .setProject(process.env.PROJECT_ID)
    .setJWT(req.headers['x-appwrite-user-jwt']);

  const account = new Account(client);

  const tablesDB = new TablesDB(client);

  const dbEnv = process.env.DATABASE_ID;
  const commentsCollEnv = process.env.COMMENTS_COLLECTION;

  try {

    const user = await account.get();

    if (!user) {
      return res.json({ result: 'Not a valid user.' });
    }

    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const commentText = (data.commentText ?? '').trim();

    log('Screening comment:', commentText);

    let verdict = '';

    if (!commentText) {
      verdict = 'fail';
      return res.json({ result: 'Comment cannot be empty.' });
    }

    // 1. Link detection
    if (checkUrls(commentText)) {
      verdict = 'fail';
      return res.json({
        result: 'Your comment contains a link, which is not allowed. Please remove any URLs and try again.',
      });
    }

    // 2. Sexually explicit content & general profanity (bad-words library)
    const filter = new Filter();

    const newBadWords = ['r3tard', 'kunt', 'kunts', 'kuntz', 'puto', 'put0', 'puta', 'put@', 'nigga', 'n*gga', 'n*gger', 'ni**er', 'nigg*r'];

    filter.addWords(...newBadWords)

    if (filter.isProfane(commentText) || filter.isProfane(variations(commentText))) {
      verdict = 'fail';
      return res.json({
        result:
          'Your comment contains sexually explicit or profane language. ' +
          'Please reword it to keep the conversation respectful.',
      });
    }

    // 3. Hate speech
    const hateMatch = containsAny(commentText, HATE_SPEECH_TERMS);
    if (hateMatch) {
      verdict = 'fail';
      return res.json({
        result:
          'Your comment appears to contain hate speech or discriminatory language. ' +
          'Please reword your comment to be respectful of all people.',
      });
    }

    // 4. Harassment / bullying
    const harassMatch = containsAny(commentText, HARASSMENT_TERMS);
    if (harassMatch) {
      verdict = 'fail';
      return res.json({
        result:
          'Your comment contains language that may be considered harassment or bullying. ' +
          'Please reword it in a more constructive and respectful way.',
      });
    }

    // 5. Spam / scam phrases
    const spamMatch = containsAny(commentText, SPAM_PHRASES);
    if (spamMatch) {
      verdict = 'fail';
      return res.json({
        result:
          'Your comment appears to contain promotional or spam content. ' +
          'Please keep comments relevant and avoid advertising.',
      });
    }

    // ✅ Passed all checks
    log('Comment passed moderation.');

    if (verdict == ! 'fail') {
      const newComment = await tablesDB.createRow({
        databaseId: dbEnv,
        tableId: commentsCollEnv,
        rowId: ID.unique(),
        data: {
          post_id: data.postId,
          comment_text: data.commentText,
          user_id: user.$id,
        }
      })
      verdict = 'ok';
      return res.json({
        result: verdict,
        $id: newComment.$id,
        comment_text: newComment.comment_text,
      });
    } else {
      return res.json({
        result: verdict,
      });
    }

  } catch (err) {
    error('Error: ' + err.message);
    return res.json({ result: 'Server error', error: err.message });
  }
};