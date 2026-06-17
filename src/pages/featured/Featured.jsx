import { useState, useEffect } from 'react';
import { usePosts } from '../../lib/hooks/usePosts';
import { Container, Row, Col } from 'react-bootstrap';
import '../../components/Grid/Grid.css';
import '../../components/Card/Card.css';
import { InstagramEmbedCards } from '../../components/Post/InstagramEmbedCards ';
import { useDocumentTitle } from '../../lib/hooks/useDocumentTitle';
import { devError, devLog } from '../../lib/utils/devConsole';
import { LoadingComponent } from '../../components/Loading/Loading';

const Featured = () => {

    useDocumentTitle('Home | FitClue');

    const { fetchTheLatestPosts } = usePosts();

    const [posts, setPosts] = useState([]);
    const [isGridLoading, setIsGridLoading] = useState(false);

    useEffect(() => {
        const getPosts = async () => {
            setIsGridLoading(true);
            try {
                const p = await fetchTheLatestPosts();

                devLog('posts', p);

                setPosts(p);

            } catch (error) {
                devError('Error getting posts:', error);
            } finally {
                setIsGridLoading(false);
            }
        };
        getPosts();
    }, []);

    if (isGridLoading) return (
        <Container>
            <Row>
                <Col>
                    <LoadingComponent className={'mt-5'} loadingText={'Loading the featured posts'} />
                </Col>
            </Row>
        </Container>);

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
                {
                    posts ? <InstagramEmbedCards
                        posts={posts}
                    /> :
                        <Col>
                            Nothing to show here, yet...
                        </Col>
                }

            </Row>

        </Container>

    );
};

export default Featured;
