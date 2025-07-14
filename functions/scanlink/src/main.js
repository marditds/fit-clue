import { GoogleGenAI } from '@google/genai';
import axios from 'axios';
import * as cheerio from 'cheerio';
import dns from 'dns/promises';

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
    const urlObj = new URL(link);
    const domain = urlObj.hostname.replace(/^www\./, '');

    const specialDomains = [
      'x.com',
      'twitter.com',
      'linkedin.com',
      'youtube.com'
    ];

    const blockedDomains = ['localhost', 'example.internal', 'malicious.com'];
    if (blockedDomains.includes(domain)) {
      return res.json({ success: false, message: 'Not a valid shopping link.' });
    }

    try {
      const addresses = await dns.lookup(urlObj.hostname, { all: true });
      const isPrivateIP = (ip) => {
        return (
          ip.startsWith('10.') ||
          ip.startsWith('172.') ||
          ip.startsWith('192.168.') ||
          ip === '127.0.0.1' ||
          ip === '::1'
        );
      };
      const ipList = addresses.map((a) => a.address);
      if (ipList.some(isPrivateIP)) {
        return res.json({ success: false, message: 'Not a valid shopping link.' });
      }
    } catch (dnsErr) {
      log(`DNS resolution failed: ${dnsErr.message}`);
      return res.json({ success: false, message: 'Failed to resolve domain.' });
    }

    const ai = new GoogleGenAI({ apiKey: GeminiApiKey });

    let content = '';

    if (!specialDomains.includes(domain)) {
      try {
        const responseFromLink = await axios.get(link, {
          timeout: 7000,           // 7-second timeout
          maxRedirects: 3,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
          }
        });

        const rawHtml = responseFromLink.data;
        const $ = cheerio.load(rawHtml);

        const title = $('title').text();
        const h1 = $('h1').map((_, el) => $(el).text()).get().join('\n');
        const paragraphs = $('p')
          .map((_, el) => $(el).text())
          .get()
          .slice(0, 10)
          .join('\n');

        content = `${title}\n${h1}\n${paragraphs}`.trim().slice(0, 8000);

      } catch (axiosErr) {
        const status = axiosErr.response?.status;
        if (axiosErr.code === 'ECONNABORTED' || status === 403) {
          log(`Blocked or timed out fetching ${link} (status: ${status || 'timeout'}). Proceeding with no content.`);
          content = '[No content available]';
        } else {
          log(`Failed to fetch link: ${axiosErr.message}`);
          return res.json({ success: false, message: 'Failed to fetch the link.', error: axiosErr.message });
        }
      }
    }

    const safetyCheckPrompt = `
You are a strict content safety assistant. Your task is to classify the safety and validity of a webpage link and its content. You must return **exactly one** of the following responses — nothing else.

- unsafe
- ok
- Not a valid shopping link

Follow the steps below:

Step 1: Check if the domain is well-known and can be classified based on your existing knowledge.

- If the domain is a known non-shopping platform (e.g., twitter.com, x.com), respond with:
Not a valid shopping link

- If the domain is a known shopping platform (e.g., amazon.com, prada.com), respond with:
ok

- If the domain is associated with adult or other NSFW content, respond with:
unsafe

If the domain is not familiar or you cannot confidently classify it, proceed to Step 2.

Step 2: If the content is not in English, translate it into English internally. Do not include any translation labels or indicate that translation occurred.

Step 3: Analyze the content.

- If it contains any NSFW material (e.g., nudity, explicit language, gore, hate speech, or illegal activity), respond with:
unsafe

- If the content is clean and safe for work **and** it appears to be from a legitimate shopping site, respond with:
ok

- If the content is clean but does not relate to online shopping, respond with:
Not a valid shopping link

You must return only one of the three valid responses: "unsafe", "ok", or "Not a valid shopping link".

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

    return res.json({ success: false, message: result });

  } catch (err) {
    error('Unhandled Error: ' + err.message);
    return res.json({ success: false, message: 'Server error', error: err.message });
  }
};