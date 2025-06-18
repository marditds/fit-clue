import { useState, useEffect } from 'react';
import { usePosts } from '../../lib/hooks/usePosts';
import { useParams } from 'react-router-dom';
import { Row } from 'react-bootstrap';
import { Card } from '../../components/Grid/Card';

const Post = () => {

    let params = useParams()

    const { fetchPostById } = usePosts();
    const [iUrl, setIUrl] = useState(null);
    const [personalityName, setPersonalityName] = useState(null);
    const [isPostLoading, setIsPostLoading] = useState(false);

    useEffect(() => {
        const getPosts = async () => {

            setIsPostLoading(true);

            try {
                const post = await fetchPostById(params.postId);

                setPersonalityName(post?.personality?.name);
                const rawUrl = post?.content?.url;

                if (rawUrl) {
                    try {
                        const url = new URL(rawUrl);
                        const parts = url.pathname.split('/').filter(Boolean);

                        const postIndex = parts.indexOf('p');
                        if (postIndex !== -1 && parts[postIndex + 1]) {
                            const postId = parts[postIndex + 1];
                            const cleanUrl = `https://www.instagram.com/p/${postId}/`;
                            setIUrl(cleanUrl);
                        }
                    } catch (error) {
                        console.error('Invalid URL', error);
                    }
                }
            } catch (error) {
                console.error('Error getting posts:', error);
            } finally {
                setIsPostLoading(false);
            }

        };

        getPosts();
    }, []);

    useEffect(() => {
        if (!iUrl) return;

        const script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        script.onload = () => {
            if (window.instgrm) {
                window.instgrm.Embeds.process();
            }
        };
        document.body.appendChild(script);
    }, [iUrl]);

    if (isPostLoading) return <div>Loading Instagram post…</div>;

    return (
        <Row>
            <h2>
                {personalityName}
            </h2>
            <Card
                iUrl={iUrl}
            />
        </Row>
    );
};

export default Post;
