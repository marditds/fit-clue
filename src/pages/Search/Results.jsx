import React, { useEffect, useState } from 'react'
import { usePosts } from '../../lib/hooks/usePosts';
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { InstagramEmbedCards } from '../../components/Post/InstagramEmbedCards ';
import { searchResultsData } from '../../lib/data/testData';
import { LoadingComponent } from '../../components/Loading/LoadingComponent';

export const Results = () => {

    const params = useParams();

    const { fetchPostsByString } = usePosts();

    const [posts, setPosts] = useState([]);
    const [isResultsLoading, setIsResultsLoading] = useState(false);

    useEffect(() => {
        const fetchAllPostsByString = async () => {
            setIsResultsLoading(true);
            try {

                const searchResults = await fetchPostsByString(params.term);

                // const searchResults = searchResultsData;

                console.log('searchResults', searchResults);

                setPosts(searchResults);

            } catch (error) {
                console.error('Error loading more results:', error);
            } finally {
                setIsResultsLoading(false);
            }
        }
        fetchAllPostsByString();
    }, [params.term]);

    return (
        <Container>

            {
                posts.length !== 0 &&
                <Row>
                    <Col>
                        Showing results for {params.term}
                    </Col>
                </Row>
            }

            <Row>
                {
                    isResultsLoading ? (
                        <Col>
                            <LoadingComponent loadingText={`Loading results for ${params.term}`} />
                        </Col>
                    ) : posts.length === 0 ? (
                        <Col>
                            <p>No results found for <strong>{params.term}</strong>.</p>
                        </Col>
                    ) : (
                        <InstagramEmbedCards posts={posts} />
                    )
                }
            </Row>

        </Container>
    )
}
