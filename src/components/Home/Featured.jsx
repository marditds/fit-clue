import { useState, useEffect } from 'react';
import { usePosts } from '../../lib/hooks/usePosts';
import { Container, Row, Col } from 'react-bootstrap';
import '../../components/Grid/Grid.css';
import '../../components/Card/Card.css';
import { InstagramEmbedCards } from '../Post/InstagramEmbedCards ';
import { useDocumentTitle } from '../../lib/hooks/useDocumentTitle';
import { devError, devLog } from '../../lib/utils/devConsole';
import { LoadingComponent } from '../Loading/Loading';

const Featured = () => {

    useDocumentTitle('Home | FitClue');

    const { fetchTheLatestPosts, fetchInstaPostById } = usePosts();

    const [posts, setPosts] = useState([]);
    const [trendingPosts, setTrendingPosts] = useState([]);
    const [isGridLoading, setIsGridLoading] = useState(false);

    const trendingPostId = '6a5fdf220010c8c12922';

    useEffect(() => {
        const getPosts = async () => {
            setIsGridLoading(true);
            try {
                const [tp, p] = await Promise.all([
                    fetchInstaPostById(trendingPostId),
                    fetchTheLatestPosts(),
                ]);

                devLog('trending', tp);
                devLog('posts', p);

                setTrendingPosts([tp]);
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
        <Container className='py-5'>
            <Row className='justify-content-start'>
                <Col>
                    <h5 className='text-uppercase secondary-text-color'>
                        Featured
                    </h5>
                </Col>
            </Row>
            <Row>

                {
                    trendingPosts.length > 0 ? <InstagramEmbedCards
                        posts={trendingPosts}
                        tag={'Trending'}
                    /> :
                        <Col>
                            Nothing is trending, yet...
                        </Col>

                }

                {
                    posts.length > 0 ? <InstagramEmbedCards
                        posts={posts}
                        tag={'New'}
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
