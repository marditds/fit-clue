import { GoogleGenAI } from '@google/genai';
import axios from 'axios';

export default async ({ req, res, log, error }) => {
  const GeminiApiKey = process.env.SCAN_LINK_API_KEY;

  try {
    let data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    log('data.link:', data.link);

    if (!data.link) {
      return res.status(400).json({ success: false, message: 'Missing link' });
    }

    const responseFromLink = await axios.get(data.link);
    const pageContent = responseFromLink.data;

    const ai = new GoogleGenAI({ apiKey: GeminiApiKey });

    const systemInstruction = `You are a content safety assistant. Analyze the following webpage content and determine if it is Safe For Work (SFW). If it is safe, respond with only the word "ok". Do not add anything else.`;

    const fullPrompt = `${systemInstruction}\n\nContent:\n${pageContent.slice(0, 8000)}`;

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
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
