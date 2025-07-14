import { GoogleGenAI } from '@google/genai';

export default async ({ req, res, log, error }) => {

  const GeminiApiKey = process.env.GEMINI_API_KEY;

  try {
    let data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    log('data.commentText:', data.commentText);

    const ai = new GoogleGenAI({ apiKey: GeminiApiKey });

    const systemInstruction = `
    Read the following text and assess whether it violates any of these points:
    
  - Spam or Scam: Unrelated promotional content, scams, or deceptive links;
  - Harassment or Bullying: Targeted abuse, threats, or personal attacks;
  - Hate Speech: Content promoting violence or discrimination against individuals or groups;
  - Rude or Condescending: The text can be interpreted as intentionally disrespectful, impolite, or demeaning. This category specifically excludes non-offensive subjective opinions about aesthetics or personal preference (e.g., "Ugly dress," "The shoes are not looking good," "I don't like this," "This is not my style").
  - Sexually Explicit Content: Inappropriate sexual language;
  - False Information: Spreading misleading or false claims.

  As a response, return the category of violation, and politely ask the user to reword their comment.

  Also, comments containing any form of link are prohibited. This includes direct URLs (e.g., www.example.com) and disguised attempts (e.g., www dot example dot com or www [.] example [.] com). If a link is detected, the comment will be rejected with a message stating that links are not allowed.

  If the comment text does not violate any of the rules, only response with one word: ok. Do not respond with variation of ok.
  `

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: `${systemInstruction}\n\n${data.commentText}`,
      config: {
        temperature: 0.0,
        topP: 0.7,
        topK: 1,
        maxOutputTokens: 52,
        responseMimeType: 'text/plain'
      }
    });

    log(response.text);

    return res.json(response.text);

  } catch (err) {
    error('Error: ' + err.message);
    return res.json({ success: false, message: 'Server error', error: err.message });
  }
};
