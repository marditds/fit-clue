import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { usePosts } from '../../lib/hooks/usePosts';
import { LoadingComponent, LoadingPage } from '../../components/Loading/Loading';
import { InstagramEmbedCards } from '../../components/Post/InstagramEmbedCards ';
import { morePersonalityData } from '../../lib/data/testData';
import { ScrollToTop } from '../../components/ScrollToTop/ScrollToTop';
import BackButton from '../../components/Navigation/BackButton';

export const More = () => {

    const params = useParams()

    const { fetchPostsByPersonalityName } = usePosts();

    const [posts, setPosts] = useState([]);
    const [postsTotal, setPostsTotal] = useState(0);
    const [personalityName, setPersonalityName] = useState('');
    const [isResultsLoading, setIsResultsLoading] = useState(false);

    useEffect(() => {
        console.log('params in more res:', params);
    }, []);

    useEffect(() => {
        const fetchAllPostsByPersonalityId = async () => {
            setIsResultsLoading(true);
            try {

                // const moreResults = await fetchPostsByPersonalityName(params.personalityName);
                // setPosts(moreResults.documents);
                // setPostsTotal(moreResults.total);
                // setPersonalityName(moreResults.documents[0]?.personality_name)

                const moreResults = morePersonalityData;
                setPosts(moreResults);
                setPostsTotal(8);
                setPersonalityName(moreResults[0]?.personality_name)

            } catch (error) {
                console.error('Error loading more results:', error);
            } finally {
                setIsResultsLoading(false);
            }
        }
        fetchAllPostsByPersonalityId();
    }, []);

    return (
        <Container>

            {/* <Row>
                <Col>
                    <BackButton />
                </Col>
            </Row> */}

            {
                posts.length !== 0 &&
                <Row className='my-4 py-2 py-sm-1 align-items-center sticky-top bg-white'>
                    <Col xs={12} sm={1}>
                        <BackButton className='mb-1' />
                    </Col>
                    <Col xs={12} sm={11}>
                        <h3 className='text-center'>
                            More from {personalityName} ({postsTotal})
                        </h3>
                        <p
                            className='text-center mb-0'
                            style={{ color: 'var(--main-accent-color-hover)' }}
                        >
                            Get more style inspiration from Heather McDonald
                        </p>
                    </Col>
                </Row>
            }

            <Row>
                {
                    !isResultsLoading ?
                        <InstagramEmbedCards
                            posts={posts}
                        /> :
                        <LoadingPage
                            loadingText={`Loading more from ${params.personalityName}`}
                        />
                }
            </Row>

            <ScrollToTop />

        </Container>
    )
}