import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai';

export default async ({ req, res, log, error }) => {
  const GeminiApiKey = process.env.GEMINI_API_KEY;

  try {
    let data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    log('data.link:', data.link);

    if (!data.link) {
      return res.json({ success: false, message: 'Missing link in request body.' });
    }

    const ai = new GoogleGenAI({ apiKey: GeminiApiKey });

    const prompt = 'Analyze the provided content and determine if it is Safe For Work. Respond with "ok" if it is SFW, otherwise respond with a reason why it is not SFW (e.g., "sexual content," "violent content," etc.).';

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: [
        { text: prompt },
        { fileData: { mimeType: 'text/uri-list', uri: data.link } }
      ],
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
      config: {
        temperature: 0,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 256,
        responseMimeType: 'text/plain'
      }
    });

    const candidates = response.candidates;

    if (candidates && candidates.length > 0) {
      const firstCandidate = candidates[0];
      const safetyRatings = firstCandidate.safetyRatings;

      const isUnsafe = safetyRatings.some(rating => {
        return rating.category === HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT &&
          (rating.probability === 'MEDIUM' || rating.probability === 'HIGH');
      });

      if (isUnsafe) {
        const problematicCategories = safetyRatings
          .filter(rating =>
            (rating.category === HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT && (rating.probability === 'MEDIUM' || rating.probability === 'HIGH'))
          )
          .map(rating => rating.category.replace('HARM_CATEGORY_', '').toLowerCase());

        return res.json({ success: false, isSFW: false, reason: `Content blocked due to: ${problematicCategories.join(', ')}` });
      } else {
        const generatedText = firstCandidate.content.parts[0].text.trim();

        if (generatedText.toLowerCase() === 'ok') {
          return res.json({ success: true, isSFW: true, message: 'ok' });
        } else {
          return res.json({ success: false, isSFW: false, reason: generatedText });
        }
      }
    } else {
      log('No candidates found in the response.');
      return res.json({ success: false, message: 'Could not determine SFW status. No candidates in response.' });
    }

  } catch (err) {
    error('Error: ' + err.message);
    return res.json({ success: false, message: 'Server error during SFW check', error: err.message });
  }
};