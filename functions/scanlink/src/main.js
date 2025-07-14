import { GoogleGenAI } from '@google/genai';
import axios from 'axios';
import cheerio from 'cheerio';

export default async ({ req, res, log, error }) => {
  const GeminiApiKey = process.env.SCAN_LINK_API_KEY;

  try {
    let data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    log('data.link:', data.link);

    if (!data.link) {
      return res.json({ success: false, message: 'Missing link' });
    }

    const normalizeUrl = (url) => {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'https://' + url;
      }
      return url;
    };

    const link = normalizeUrl(data.link);
    const domain = new URL(link).hostname.replace(/^www\./, '');

    const specialDomains = ['x.com', 'twitter.com'];

    const ai = new GoogleGenAI({ apiKey: GeminiApiKey });

    let content = '';

    if (!specialDomains.includes(domain)) {
      const responseFromLink = await axios.get(link, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36'
        }
      });

      const rawHtml = responseFromLink.data;
      const $ = cheerio.load(rawHtml);

      const title = $('title').text();
      const h1 = $('h1').map((_, el) => $(el).text()).get().join('\n');
      const paragraphs = $('p').map((_, el) => $(el).text()).get().join('\n');

      content = `${title}\n${h1}\n${paragraphs}`.trim().slice(0, 8000); // Max input chunk
    }

    const safetyCheckPrompt = `
You are a strict content safety assistant.

Step 1: If the following content is not in English, silently translate it into English. Do not say "translated text" or anything else. Just continue to the next step using the English version internally.

Step 2: Analyze the English content.

- If the content contains any NSFW material (e.g. nudity, explicit language, gore, hate speech, illegal activity), respond with **only**:
unsafe

- If the content is clean and safe for work, respond with:
ok

- If the domain is a known non-shopping platform (like twitter.com or x.com), respond with:
Not a valid shopping link.

- If the content of the webpage is safe, but it does not associate with any online shop, respond with:
Not a valid shopping link.

You must return exactly one of these answers — nothing else.

---

Link: ${link}

Content: ${specialDomains.includes(domain) ? '[No content available]' : content}
    `.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: safetyCheckPrompt,
      config: {
        temperature: 0.2,
        topP: 0.8,
        maxOutputTokens: 1024,
        responseMimeType: 'text/plain'
      }
    });

    const result = response.text.trim();
    log('Model response:', result);

    return res.json({ result });

  } catch (err) {
    error('Error: ' + err.message);
    return res.json({ success: false, message: 'Server error', error: err.message });
  }
};