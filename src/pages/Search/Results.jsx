import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useOutletContext, useParams } from 'react-router-dom';
import { usePosts } from '../../lib/hooks/usePosts';
import { LoadingComponent } from '../../components/Loading/LoadingComponent';
import { InstagramEmbedCards } from '../../components/Post/InstagramEmbedCards ';
import { searchResultsData } from '../../lib/data/testData';

export const Results = () => {

    let params = useParams()

    const { userId, username, isLoggedIn } = useOutletContext();

    const { fetchPostsByPersonalityId } = usePosts();

    const [posts, setPosts] = useState([]);
    const [personalityName, setPersonalityName] = useState('');
    const [isResultsLoading, setIsResultsLoading] = useState(false);

    useEffect(() => {
        console.log('params in search res:', params);
    }, []);

    useEffect(() => {
        const fetchAllPostsByPersonalityId = async () => {
            setIsResultsLoading(true);
            try {

                const searchResults = await fetchPostsByPersonalityId(params.personalityId);

                // const searchResults = searchResultsData;

                setPosts(searchResults);
                setPersonalityName(searchResults[0]?.personality?.name)

            } catch (error) {
                console.error('Error loading search results:', error);
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
                    Showing results for {personalityName}.
                </Col>
            </Row>

            <Row>
                <InstagramEmbedCards
                    posts={posts}
                />
            </Row>

        </Container>
    )
}
