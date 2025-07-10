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

                const moreResults = morePersonalityData;

                setPosts(moreResults);
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
                <Row className='my-4 align-items-center sticky-top bg-white'>
                    <Col>
                        <BackButton />
                    </Col>
                    <Col>
                        <h3
                            className='text-center'
                        >
                            More from {personalityName}
                        </h3>
                        <p
                            className='text-center mb-0'
                            style={{ color: 'var(--main-accent-color-hover)' }}
                        >
                            Get more style inspiration from Heather McDonald
                        </p>
                    </Col>
                    <Col></Col>
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