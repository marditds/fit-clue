
export default async ({ req, res, log, error }) => {

    const oembedToken = process.env.META_IG_TOKEN;

    try {
        const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

        const response = await axios.get(`https://graph.facebook.com/v19.0/instagram_oembed`, {
            params: {
                url: 'https://www.instagram.com/p/DKPlBdQxQ3O/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
                oembedToken,
                omit_script: false
            }
        });

        console.log(response);

        res.json(response.data);

    } catch (err) {
        error('Error: ' + err.message);
        return res.json({ success: false, message: 'Server error', error: err.message });
    }
};
