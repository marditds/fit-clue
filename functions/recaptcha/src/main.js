export default async ({ req, res, log, error }) => {
    // const oembedToken = process.env.META_USER_TOKEN;

    try {

        log('THIS IS RECAPTCHA FUNCTION.')
        // const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

        // log('data:', data);
        // log('data.url:', data.url);

        // const url = `https://graph.facebook.com/v19.0/instagram_oembed?` +
        //     new URLSearchParams({
        //         url: data.url,
        //         access_token: oembedToken,
        //         omit_script: 'false'
        //     });

        // log('url:', url);

        // const response = await fetch(url);

        // log('response:', response);

        // const text = await response.text();
        // log('Raw response body:', text);

        // if (!response.ok) {
        //     throw new Error(`Fetch failed with status ${response.status}`);
        // }

        // const result = await response.json();

        // log('result:', result);

        return 'THIS IS RECAPTCHA FUNCTION. 2';

    } catch (err) {
        error('Error: ' + err.message);
        return res.json({ success: false, message: 'Server error', error: err.message });
    }
};
