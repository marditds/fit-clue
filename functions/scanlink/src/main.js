import { GoogleGenAI } from '@google/genai';
import axios from 'axios';

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

    const systemInstruction = `You are a content safety assistant. Analyze the following domain name or the webpage content. If you recognize the domain name as platforms that are used for distributing and/or sharing NSFW content, immediately respond with "unsafe." If it is not apparent from the domain name, analyze the content of the webpage to determine if it is Safe For Work (SFW). If it is safe, respond with only the word "ok". If it contains any Not Safe For Work (NSFW) content (e.g., nudity, sexually explicit material, violence, gore, hate speech, illegal activities), respond with "unsafe". Do not add anything else. Additionally, if you recognize the domain name and the domain is never used to sell products such as twitter.com or x.com, respond with "Not a valid shopping link."`;

    let fullPrompt;

    if (specialDomains.includes(domain)) {

      fullPrompt = `${systemInstruction}\n\nLink:\n${link}`;

    } else {
      const responseFromLink = await axios.get(link, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36'
        }
      });
      const pageContent = responseFromLink.data;
      fullPrompt = `${systemInstruction}\n\nLink:\n${link}\nContent:\n${pageContent.slice(0, 8000)}`;

    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: fullPrompt,
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