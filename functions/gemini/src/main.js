import { GoogleGenAI } from '@google/genai';

export default async ({ req, res, log, error }) => {

  const GeminiApiKey = process.env.GEMINI_API_KEY;

  try {
    const data = req.body;

    log('data', data);

    const ai = new GoogleGenAI({ apiKey: GeminiApiKey });

    // const systemInstruction = 'Read the follwoing text and assess whether it violates any of these points: \n-Spam or Scam: Unrelated promotional content, scams, or deceptive links; \n-Harassment or Bullying: Targeted abuse, threats, or personal attacks; \n-Hate Speech: Content promoting violence or discrimination against individuals or groups; \n-Sexually Explicit Content: Inappropriate sexual language; \n-False Information: Spreading misleading or false claims. As a response, return the category of violation, and politely ask the user to reword their comment. \nAdditionally, if the comment text includes a link, reject the comment and tell the user that links are not allowed in the comment section. If the user alternates the text of the link and wants to trick the system such as \'www dot example dot com\', or \'www [.] example [.] com, and such, reject the comment text immediately by telling them that links are not allowed in the comment section. \nIf the comment text does not violate any of the rules, only response with one word: \'Ok\'.'

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      // contents: `${systemInstruction}\n\n${data.commentText}`,
      contents: `Who invented the ${data.commentText} alphabet?`,
      config: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
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
