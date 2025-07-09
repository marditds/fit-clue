import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useOutletContext, useParams } from 'react-router-dom';
import { usePosts } from '../../lib/hooks/usePosts';

export const Results = () => {

    let params = useParams()

    const { userId, username, isLoggedIn } = useOutletContext();

    const { fetchPostsByPersonalityId } = usePosts();

    const [isLoadingResults, setIsLoadingResults] = useState(false);

    useEffect(() => {
        console.log('params in search res:', params);

    }, []);

    useEffect(() => {
        const fetchAllPostsByPersonalityId = async () => {
            setIsLoadingResults(true);
            try {

                await fetchPostsByPersonalityId(params.personalityId);

            } catch (error) {
                console.error('Error loading search results:', error);
            } finally {
                setIsLoadingResults(false);
            }
        }
        fetchAllPostsByPersonalityId();
    }, []);

    return (
        <Container>
            <Row>
                <Col>
                    Showing results for {params.personalityId}
                </Col>
            </Row>
        </Container>
    )
}
