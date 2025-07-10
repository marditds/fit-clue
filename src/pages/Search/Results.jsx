import { useEffect, useState } from 'react'
import { usePosts } from '../../lib/hooks/usePosts';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { InstagramEmbedCards } from '../../components/Post/InstagramEmbedCards ';
import { LoadingPage } from '../../components/Loading/Loading';
import { ScrollToTop } from '../../components/ScrollToTop/ScrollToTop';
import BackButton from '../../components/Navigation/BackButton';
import { SearchForm } from '../../components/Form/SearchForm';
import { searchResultsData } from '../../lib/data/testData';

export const Results = () => {

    const params = useParams();

    const { fetchPostsByString } = usePosts();

    const [searchTerm, setSearchTerm] = useState(params.term);
    const [results, setResults] = useState([]);
    const [resultsTotal, setResultsTotal] = useState(0);
    const [isResultsLoading, setIsResultsLoading] = useState(false);

    const fetchAllPostsByString = async () => {
        setIsResultsLoading(true);
        try {
            console.log('Search term in fetchAllPostsByString:', searchTerm);

            // const searchResults = await fetchPostsByString(searchTerm);

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

    useEffect(() => {
        fetchAllPostsByString();
    }, []);

    const onSearchTermSubmit = async (e) => {
        console.log('Calling search.');
        e.preventDefault();
        await fetchAllPostsByString();
    }

    return (
        <Container
            style={{
                minHeight: 'calc(100vh - 112px)'
            }}
        >

            <Row className='my-4 align-items-start sticky-top bg-white'>
                <Col xs={1}>
                    <BackButton />
                </Col>
                <Col xs={11}>

                    <Form onSubmit={onSearchTermSubmit}>
                        <div className='d-flex'>
                            <SearchForm
                                searchFieldPlacement='ResultsPage'
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                            />
                        </div>
                        <Form.Text>
                            Found {resultsTotal} result{resultsTotal > 1 ? 's' : ''}
                        </Form.Text>
                    </Form>
                </Col>
            </Row>


            <Row>
                {
                    isResultsLoading ? (
                        <Col>
                            <LoadingPage loadingText={`Loading results for ${searchTerm || params.term}`} />
                        </Col>
                    ) : results.length === 0 ? (
                        null
                    ) : (
                        <InstagramEmbedCards posts={results} />
                    )
                }
            </Row>

            <ScrollToTop />

        </Container>
    )
}
