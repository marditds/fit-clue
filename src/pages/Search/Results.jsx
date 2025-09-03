import { useEffect, useState } from 'react'
import { usePosts } from '../../lib/hooks/usePosts';
import { useNavigate, useParams } from 'react-router-dom';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { InstagramEmbedCards } from '../../components/Post/InstagramEmbedCards ';
import { LoadingPage } from '../../components/Loading/Loading';
import { ScrollToTop } from '../../components/ScrollToTop/ScrollToTop';
import { SearchComponent, SearchField } from '../../components/Form/SearchForm';
import { LoadMoreButton, RelatedPosts } from '../../components/RelatedPosts/RelatedPosts';
import { IconAdjustments, IconAdjustmentsFilled, IconHanger, } from '@tabler/icons-react';
import { searchResultsData } from '../../lib/data/testData';
import { Icon } from '../../components/Accessories/Icon';

const Results = () => {

    const params = useParams();

    const navigate = useNavigate();

    const { searchResultLoadLimit, fetchPostsByString, fetchPostsByItemName } = usePosts();

    const { isXs, isSm, isMd } = useBreakpoints();

    const isScreenLargeAndLarger = !isXs && !isSm && !isMd;

    const [searchTerm, setSearchTerm] = useState(params.term);
    const [searchCategory, setSearchCategory] = useState(params.category);
    const [showCategories, setShowCategories] = useState(false);

    // Personality results
    const [results, setResults] = useState([]);
    const [resultsTotal, setResultsTotal] = useState(0);
    const [isResultsFirstBatchLoading, setIsResultsFirstBatchLoading] = useState(false);
    const [isResultsLoading, setIsResultsLoading] = useState(false);
    const [isOnLoadMoreResultsClicked, setIsOnLoadMoreResultsClicked] = useState(false);

    const [lastResult, setLastResult] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchAllPostsBySearchTerm = async (isNewSearch = false) => {

        if (isResultsLoading || (!hasMore && !isNewSearch)) {
            return;
        }

        setIsResultsLoading(true);

        try {
            const cursor = isNewSearch ? null : lastResult;

            console.log('Search term in fetchAllPostsBySearchTerm:', searchTerm);

            let searchResults = null;

            if (searchCategory === 'personality') {
                searchResults = await fetchPostsByString(searchTerm, cursor);
            }

            if (searchCategory === 'item') {
                const normalizedSearchTerm = searchTerm.toLocaleLowerCase();

                console.log('normalizedSearchTerm:', normalizedSearchTerm);

                searchResults = await fetchPostsByItemName(normalizedSearchTerm, cursor);
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
                await fetchAllPostsBySearchTerm(true);
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
            if (searchCategory.trim() && searchTerm.trim()) {
                navigate(
                    `/search/${encodeURIComponent(searchCategory)}/${encodeURIComponent(searchTerm)}`
                );
            };
            await fetchAllPostsBySearchTerm(true);
        } catch (error) {
            console.error('Error onSearchTermSubmit', error);
        } finally {
            setIsOnLoadMoreResultsClicked(false);
            setShowCategories(false);
        }
    }

    const onLoadMoreResultsClick = async () => {
        await fetchAllPostsBySearchTerm(false);
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
                <SearchComponent
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onSubmit={onSearchTermSubmit}
                    setSearchCategory={setSearchCategory}
                    searchCategory={searchCategory}
                    resultsTotal={resultsTotal}
                    setResultsTotal={setResultsTotal}
                />
                {/* <Form
                    onSubmit={onSearchTermSubmit}
                    className={(!isXs && !isSm && !isMd) ? 'w-50 mx-auto' : 'w-100'}
                >
                    <div className='d-flex justify-content-center'>
                        <SearchField
                            searchFieldPlacement='ResultsPage'
                            searchTerm={searchTerm}
                            isLoading={isResultsLoading}
                            setSearchTerm={setSearchTerm}
                        />
                    </div>

                    <div className='mt-2 w-100 d-flex algin-items-center'>

                        <Form.Text className='d-flex align-items-center'>
                            Found {resultsTotal} result{resultsTotal > 1 ? 's' : ''}
                        </Form.Text>

                        <Button
                            onClick={() => setShowCategories(preVal => !preVal)}
                            className='ms-auto d-flex justify-content-center align-items-center py-0'
                        >
                            {!showCategories ?
                                <IconAdjustments stroke={1} className={`slider-icon ${isScreenLargeAndLarger ? 'me-2' : 'me-0'}`} /> :
                                <IconAdjustmentsFilled className={`slider-icon ${isScreenLargeAndLarger ? 'me-2' : 'me-0'}`} />
                            }
                            {isScreenLargeAndLarger && 'Search Options'}
                        </Button>
                    </div>

                    {showCategories &&
                        <div className='mt-2 d-flex align-items-center justify-content-end'>
                            <h6 className='mb-0 me-3'>
                                Search By:
                            </h6>
                            <Form.Check
                                inline
                                label={<><Icon className='bi bi-person fs-5' marginEndSize='2' />Personality</>}
                                name='searchCategories'
                                type='radio'
                                id={`inline-radio-1`}
                                value='personality'
                                className='searchChkBx'
                                checked={searchCategory === 'personality'}
                                onChange={(e) => setSearchCategory(e.target.value)}
                            />
                            <Form.Check
                                inline
                                label={<><IconHanger stroke={1.25} className='me-2' />Item</>}
                                name='searchCategories'
                                type='radio'
                                id={`inline-radio-2`}
                                value='item'
                                className='me-0'
                                checked={searchCategory === 'item'}
                                onChange={(e) => setSearchCategory(e.target.value)}
                            />
                        </div>
                    }
                </Form> */}
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