import { useState, useEffect } from 'react';
import { usePosts } from '../../lib/hooks/usePosts';
import { Container, Row, Col } from 'react-bootstrap';
import '../../components/Grid/Grid.css';
import '../../components/Card/Card.css';
import { InstagramEmbedCards } from '../../components/Post/InstagramEmbedCards ';
import { theLatestData } from '../../lib/data/testData';
import { useDocumentTitle } from '../../lib/hooks/useDocumentTitle';

const Featured = () => {

    useDocumentTitle('Home | FitClue');

    const { fetchTheLatestPosts } = usePosts();

    const [posts, setPosts] = useState([]);
    const [isGridLoading, setIsGridLoading] = useState(false);

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

    if (isGridLoading) return <div>Loading the latest…</div>;

    return (
        <Container
            className='py-5'
        >
            <Row className='justify-content-start'>
                <Col className=''>
                    <h2 className='latest__page-title'>
                        FEATURED
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

export default Featured;
