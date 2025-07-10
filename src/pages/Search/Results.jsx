import React, { useEffect, useState } from 'react'
import { usePosts } from '../../lib/hooks/usePosts';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { InstagramEmbedCards } from '../../components/Post/InstagramEmbedCards ';
import { searchResultsData } from '../../lib/data/testData';
import { LoadingComponent, LoadingPage } from '../../components/Loading/Loading';
import { ScrollToTop } from '../../components/ScrollToTop/ScrollToTop';
import BackButton from '../../components/Navigation/BackButton';

export const Results = () => {

    const params = useParams();

    const { fetchPostsByString } = usePosts();

    const [results, setResults] = useState([]);
    const [resultsTotal, setResultsTotal] = useState(0);
    const [isResultsLoading, setIsResultsLoading] = useState(false);

    useEffect(() => {
        const fetchAllPostsByString = async () => {
            setIsResultsLoading(true);
            try {

                // const searchResults = await fetchPostsByString(params.term);

                const searchResults = searchResultsData;

                console.log('searchResults', searchResults);

                setResultsTotal(searchResults.total);
                setResults(searchResults.documents);

            } catch (error) {
                console.error('Error loading more results:', error);
            } finally {
                setIsResultsLoading(false);
            }
        }
        fetchAllPostsByString();
    }, [params.term]);

    return (
        <Container
            style={{
                minHeight: 'calc(100vh - 112px)'
            }}
        >

            {
                results.length !== 0 &&
                <Row className='my-4 align-items-center sticky-top bg-white'>
                    <Col>
                        <BackButton />
                    </Col>
                    <Col xs={10}>
                        <h3>
                            Search Results
                        </h3>
                        <Form>
                            <div className='d-flex'>
                                <Form.Control
                                    type='search'
                                    placeholder='Search'
                                    className='me-2'
                                    aria-label='Search'
                                    value={params.term}
                                // onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Button type='submit'>Search</Button>
                            </div>
                            <Form.Text>
                                Found {resultsTotal} result{resultsTotal > 1 ? 's' : ''}
                            </Form.Text>
                        </Form>
                    </Col>
                </Row>
            }

            <Row>
                {
                    isResultsLoading ? (
                        <Col>
                            <LoadingPage loadingText={`Loading results for ${params.term}`} />
                        </Col>
                    ) : results.length === 0 ? (
                        <Col>
                            <p>No results found for <strong>{params.term}</strong>.</p>
                        </Col>
                    ) : (
                        <InstagramEmbedCards posts={results} />
                    )
                }
            </Row>

            <ScrollToTop />

        </Container>
    )
}
