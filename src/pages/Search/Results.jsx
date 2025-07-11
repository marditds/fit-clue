import { useEffect, useState } from 'react'
import { usePosts } from '../../lib/hooks/usePosts';
import { useParams } from 'react-router-dom';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { InstagramEmbedCards } from '../../components/Post/InstagramEmbedCards ';
import { LoadingPage } from '../../components/Loading/Loading';
import { ScrollToTop } from '../../components/ScrollToTop/ScrollToTop';
import { SearchForm } from '../../components/Form/SearchForm';
import { RelatedPosts } from '../../components/RelatedPosts/RelatedPosts';
import { searchResultsData } from '../../lib/data/testData';

export const Results = () => {

    const params = useParams();

    const { fetchPostsByString } = usePosts();

    const { isXs, isSm, isMd } = useBreakpoints();

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

            <RelatedPosts
                headerText='Search Results'
            >
                <Form onSubmit={onSearchTermSubmit} className={(!isXs && !isSm && !isMd) ? 'w-50 mx-auto' : 'w-100'}>
                    <div className='d-flex justify-content-center'>
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
            </RelatedPosts>

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
