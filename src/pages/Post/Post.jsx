import { useEffect, useState } from 'react';

const Post = () => {
    const [embedHtml, setEmbedHtml] = useState('');
    const [postUrl, setPostUrl] = useState('');
    const [submittedUrl, setSubmittedUrl] = useState('');

    useEffect(() => {
        const fetchEmbed = async () => {
            if (!submittedUrl) {
                return
            }

            try {

                console.log('submittedUrl:', submittedUrl);

                const response = await fetch(
                    `https://graph.facebook.com/v19.0/instagram_oembed?url=${encodeURIComponent(submittedUrl)}&access_token=${import.meta.env.VITE_IG_TOKEN}`
                );
                console.log('response in Post.js:', response);

                const data = await response.json();
                console.log('data in Post.js:', data);

                setEmbedHtml(data.html);

                // Ensure embed script is loaded
                if (window.instgrm) {
                    window.instgrm.Embeds.process();
                }
            } catch (error) {
                console.error('Failed to fetch Instagram embed:', error);
                setEmbedHtml('<p>Failed to load post.</p>');
            }
        };

        fetchEmbed();
    }, [submittedUrl]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmittedUrl(postUrl);
    };

    useEffect(() => {
        console.log('postUrl:', postUrl);
    }, [postUrl])

    return (
        <div>
            <h2>Embed Instagram Post</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter Instagram post URL"
                    value={postUrl}
                    onChange={(e) => {
                        console.log(e.target.value);
                        setPostUrl(e.target.value)
                    }}
                    style={{ width: '300px' }}
                />
                <button type="submit">Embed</button>
            </form>

            <div
                className="instagram-embed"
                dangerouslySetInnerHTML={{ __html: embedHtml }}
                style={{ marginTop: '20px' }}
            />

            <script async src="//www.instagram.com/embed.js"></script>
        </div>
    );
};

export default Post;
