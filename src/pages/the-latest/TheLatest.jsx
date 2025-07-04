import { useState, useEffect } from 'react';
import { usePosts } from '../../lib/hooks/usePosts';
import { Container, Row, Col } from 'react-bootstrap';
import { Card } from '../../components/Grid/Card';
import '../../components/Grid/Grid.css';
import '../../components/Card/Card.css';
import { useUser } from '../../lib/hooks/useUser';
import { theLatestData } from '../../lib/data/testData';

const TheLatest = () => {

    // const { getUserSession } = useUser();

    const { fetchTheLatestPosts } = usePosts();
    const [posts, setPosts] = useState([]);
    const [isGridLoading, setIsGridLoading] = useState(false);

    // useEffect(() => {
    //     getUserSession();
    // }, [])

    useEffect(() => {
        const getPosts = async () => {
            setIsGridLoading(true);
            try {
                // const p = await fetchTheLatestPosts();
                const p = theLatestData;

                console.log('posts', p);

                setPosts(p);
            } catch (error) {
                console.error('Error getting posts:', error);
            } finally {
                setIsGridLoading(false);
            }
        };
        getPosts();
    }, []);

    useEffect(() => {
        if (posts.length === 0) return;

        const script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        script.onload = () => {
            if (window.instgrm) {
                window.instgrm.Embeds.process();
            }
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [posts]);


    if (isGridLoading) return <div>Loading the latest…</div>;

    return (
        <Container
            className='py-5'
        // className='min-vh-100 d-flex flex-column justify-content-center align-items-stretch latest__container'
        >
            <Row className='justify-content-start'>
                <Col className=''>
                    <h2 className='latest__page-title'>
                        THE LATEST
                    </h2>
                </Col>
            </Row>
            <Row>
                {posts.map((post) => {

                    const id = post?.content?.$id;
                    const rawUrl = post?.content?.url;
                    const personalityName = post?.personality?.name;

                    let iUrl = null;
                    try {
                        const url = new URL(rawUrl);
                        const parts = url.pathname.split('/').filter(Boolean);
                        const postIndex = parts.indexOf('p') !== -1 ? parts.indexOf('p') : parts.indexOf('reel');
                        if (postIndex !== -1 && parts[postIndex + 1]) {
                            const postId = parts[postIndex + 1];
                            iUrl = `https://www.instagram.com/${parts[postIndex]}/${postId}/`;
                        }
                    } catch (e) {
                        console.error('Invalid URL:', rawUrl);
                    }
                    return (
                        <Card
                            key={id}
                            id={id}
                            personalityName={personalityName}
                            iUrl={iUrl}
                        />
                    );
                })}
            </Row>
        </Container>


    );
};

export default TheLatest;
