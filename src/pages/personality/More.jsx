import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useOutletContext, useParams } from 'react-router-dom';
import { usePosts } from '../../lib/hooks/usePosts';
import { LoadingComponent } from '../../components/Loading/LoadingComponent';
import { InstagramEmbedCards } from '../../components/Post/InstagramEmbedCards ';
import { morePersonalityData } from '../../lib/data/testData';

export const More = () => {

    const params = useParams()

    const { userId, username, isLoggedIn } = useOutletContext();

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

                const moreResults = await fetchPostsByPersonalityName(params.personalityName);

                // const moreResults = morePersonalityData;

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
            <Row>
                <Col>
                    More from {personalityName}
                </Col>
            </Row>

            <Row>
                {
                    !isResultsLoading ?
                        <InstagramEmbedCards
                            posts={posts}
                        /> :
                        <LoadingComponent
                            loadingText={`Loading results for ${params.personalityName}`}
                        />
                }

            </Row>

        </Container>
    )
}