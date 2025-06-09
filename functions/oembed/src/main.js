export default async ({ req, res, log, error }) => {
    const oembedToken = process.env.META_IG_TOKEN;

    try {
        const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

        const url = `https://graph.facebook.com/v19.0/instagram_oembed?` +
            new URLSearchParams({
                url: data,
                access_token: oembedToken,
                omit_script: 'false'
            });

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Fetch failed with status ${response.status}`);
        }

        const result = await response.json();

        log(result);

        return res.json(result);

    } catch (err) {
        error('Error: ' + err.message);
        return res.json({ success: false, message: 'Server error', error: err.message });
    }
};
