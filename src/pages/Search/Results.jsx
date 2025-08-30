import { useEffect, useState } from 'react'
import { usePosts } from '../../lib/hooks/usePosts';
import { useParams } from 'react-router-dom';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { InstagramEmbedCards } from '../../components/Post/InstagramEmbedCards ';
import { LoadingPage } from '../../components/Loading/Loading';
import { ScrollToTop } from '../../components/ScrollToTop/ScrollToTop';
import { SearchForm } from '../../components/Form/SearchForm';
import { LoadMoreButton, RelatedPosts } from '../../components/RelatedPosts/RelatedPosts';
import { searchResultsData } from '../../lib/data/testData';

const Results = () => {

    const params = useParams();

    const { searchResultLoadLimit, fetchPostsByString } = usePosts();

    const { isXs, isSm, isMd } = useBreakpoints();

    const [searchTerm, setSearchTerm] = useState(params.term);
    const [searchCategory, setSearchCategory] = useState(params.category);

    // Personality results
    const [results, setResults] = useState([]);
    const [resultsTotal, setResultsTotal] = useState(0);
    const [isResultsFirstBatchLoading, setIsResultsFirstBatchLoading] = useState(false);
    const [isResultsLoading, setIsResultsLoading] = useState(false);
    const [isOnLoadMoreResultsClicked, setIsOnLoadMoreResultsClicked] = useState(false);

    const [lastResult, setLastResult] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchAllPostsByString = async (isNewSearch = false) => {

        if (isResultsLoading || (!hasMore && !isNewSearch)) {
            return;
        }

        setIsResultsLoading(true);

        try {
            const cursor = isNewSearch ? null : lastResult;

            console.log('Search term in fetchAllPostsByString:', searchTerm);

            let searchResults = null;

            if (searchCategory === 'personality') {
                searchResults = await fetchPostsByString(searchTerm, cursor);
            }

            if (searchCategory === 'item') {
                console.log('Category is item.');
                setResults([]);
                setResultsTotal(0);
                return;
            }

            console.log('searchResults', searchResults);

            const total = searchResults.total;
            const newDocuments = searchResults.rows;

            console.log('newDocuments', newDocuments);

            setResultsTotal(total);

            setResults(prevResults =>
                isNewSearch ? newDocuments : [...prevResults, ...newDocuments]
            );

            if (newDocuments.length === 0 || newDocuments.length === total) {
                setHasMore(false);
                return;
            }

            setLastResult(newDocuments[newDocuments.length - 1].$id || null);

            setHasMore(newDocuments.length === searchResultLoadLimit);

            if (searchResults.rows.length < searchResultLoadLimit) {
                {
                    setHasMore(false);
                }
            }

        } catch (error) {
            console.error('Error loading more results:', error);
        } finally {
            setIsResultsLoading(false);
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [isOnLoadMoreResultsClicked]);

    useEffect(() => {
        const loadingResultsFirstBatch = async () => {
            setIsResultsFirstBatchLoading(true);
            try {
                await fetchAllPostsByString(true);
            } catch (error) {
                console.error('Error loading search results.');
            } finally {
                setIsResultsFirstBatchLoading(false);
            }
        }
        setResults([]);
        setLastResult(null);
        loadingResultsFirstBatch();
    }, []);

    const onSearchTermSubmit = async (e) => {
        e.preventDefault();
        setIsOnLoadMoreResultsClicked(true);
        try {
            await fetchAllPostsByString(true);
        } catch (error) {
            console.error('Error onSearchTermSubmit', error);
        } finally {
            setIsOnLoadMoreResultsClicked(false);
        }
    }

    const onLoadMoreResultsClick = async () => {
        await fetchAllPostsByString(false);
    }

    useEffect(() => {
        console.log('searchCategory:', searchCategory);
    }, [searchCategory])

    if (isResultsFirstBatchLoading) {
        return (
            <LoadingPage loadingText={`Loading results for ${searchTerm || params.term}`} />
        )
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
                <Form
                    onSubmit={onSearchTermSubmit}
                    className={(!isXs && !isSm && !isMd) ? 'w-50 mx-auto' : 'w-100'}
                >
                    <div className='d-flex justify-content-center'>
                        <SearchForm
                            searchFieldPlacement='ResultsPage'
                            searchTerm={searchTerm}
                            isLoading={isResultsLoading}
                            setSearchTerm={setSearchTerm}
                        />
                    </div>
                    <Form.Text>
                        Found {resultsTotal} result{resultsTotal > 1 ? 's' : ''}
                    </Form.Text>
                </Form>

                <h6>Search By:</h6>
                <Form>
                    <Form.Check
                        inline
                        label='Personality Name'
                        name='searchCategories'
                        type='radio'
                        id={`inline-radio-1`}
                        value="personality"
                        checked={searchCategory === 'personality'}
                        onChange={(e) => setSearchCategory(e.target.value)}
                    />
                    <Form.Check
                        inline
                        label='Item Name'
                        name='searchCategories'
                        type='radio'
                        id={`inline-radio-2`}
                        value="item"
                        checked={searchCategory === 'item'}
                        onChange={(e) => setSearchCategory(e.target.value)}
                    />
                </Form>

            </RelatedPosts>

            <Row>
                {
                    results.length === 0 ? (
                        null
                    ) : (
                        <>
                            <InstagramEmbedCards posts={results} />
                            <Col xs={12}>
                                <Row className='mx-auto'>
                                    <Col className='px-0 justify-content-center'>
                                        <LoadMoreButton
                                            hasMore={hasMore}
                                            onClick={onLoadMoreResultsClick}
                                            isLoading={isResultsLoading}
                                            loadMoreText={`Load more results for for ${searchTerm}`}
                                            loadingText={`Loading more results for ${searchTerm}`}
                                            noMoreText='No more results'
                                            className='w-100 mb-3 mt-1'
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </>
                    )
                }
            </Row>

            <ScrollToTop />

        </Container>
    )
}

export default Results; 