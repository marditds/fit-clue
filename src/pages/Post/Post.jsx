import { useState, useEffect } from 'react';
import { usePosts } from '../../lib/hooks/usePosts';

const Post = () => {
    const { fetchPosts } = usePosts();
    const [postUrl, setPostUrl] = useState(null);

    useEffect(() => {
        const getPosts = async () => {
            const posts = await fetchPosts();
            const rawUrl = posts[1]?.post?.url;

            if (rawUrl) {
                try {
                    const url = new URL(rawUrl);
                    const parts = url.pathname.split('/').filter(Boolean);

                    const postIndex = parts.indexOf('p');
                    if (postIndex !== -1 && parts[postIndex + 1]) {
                        const postId = parts[postIndex + 1];
                        const cleanUrl = `https://www.instagram.com/p/${postId}/`;
                        setPostUrl(cleanUrl);
                    }
                } catch (error) {
                    console.error('Invalid URL', error);
                }
            }
        };

        getPosts();
    }, []);

    useEffect(() => {
        if (!postUrl) return;

        const script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        script.onload = () => {
            if (window.instgrm) {
                window.instgrm.Embeds.process();
            }
        };
        document.body.appendChild(script);
    }, [postUrl]);

    if (!postUrl) return <div>Loading Instagram post…</div>;

    return (
        <div>
            <blockquote
                className='instagram-media'
                data-instgrm-permalink={postUrl}
                data-instgrm-version='14'
                style={{
                    background: '#FFF',
                    border: 0,
                    borderRadius: '3px',
                    boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                    margin: '1px',
                    maxWidth: '540px',
                    minWidth: '100px',
                    padding: 0,
                    width: 'calc(100% - 2px)'
                }}
            >
                <div style={{ padding: '16px' }}>
                    <a
                        href={postUrl}
                        style={{
                            background: '#FFFFFF',
                            lineHeight: 0,
                            padding: '0 0',
                            textAlign: 'center',
                            textDecoration: 'none',
                            width: '100%'
                        }}
                        target='_blank'
                        rel='noreferrer'
                    >
                        <div style={{ paddingTop: '8px' }}>
                            <div
                                style={{
                                    color: '#3897f0',
                                    fontFamily: 'Arial,sans-serif',
                                    fontSize: '14px',
                                    fontWeight: 550,
                                    lineHeight: '18px'
                                }}
                            >
                                View this post on Instagram
                            </div>
                        </div>
                    </a>
                </div>
            </blockquote>
        </div>
    );
};

export default Post;
