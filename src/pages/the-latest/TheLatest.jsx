import { useState, useEffect } from 'react';
import { usePosts } from '../../lib/hooks/usePosts';
import { Container, Row, Col } from 'react-bootstrap';
import { Card } from '../../components/Grid/Card';
import '../../components/Grid/Grid.css';
import '../../components/Card/Card.css';
import { useUser } from '../../lib/hooks/useUser';
import { theLatestData } from '../../lib/data/testData';
import { InstagramEmbedCards } from '../../components/Post/InstagramEmbedCards ';

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
                const p = await fetchTheLatestPosts();
                // const p = theLatestData;

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

    if (isGridLoading) return <div>Loading the latest…</div>;

    return (
        <Container
            className='py-5'
        >
            <Row className='justify-content-start'>
                <Col className=''>
                    <h2 className='latest__page-title'>
                        THE LATEST
                    </h2>
                </Col>
            </Row>
            <Row>
                <InstagramEmbedCards
                    posts={posts}
                />
            </Row>
        </Container>


    );
};

export default TheLatest;
