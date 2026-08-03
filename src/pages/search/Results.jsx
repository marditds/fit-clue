import { useEffect, useState } from 'react'
import { usePosts } from '../../lib/hooks/usePosts';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { InstagramEmbedCards } from '../../components/Post/InstagramEmbedCards ';
import { LoadingComponent, LoadingPage } from '../../components/Loading/Loading';
import { ScrollToTop } from '../../components/ScrollToTop/ScrollToTop';
import { SearchComponent } from '../../components/Form/SearchForm';
import { LoadMoreButton, RelatedPosts } from '../../components/RelatedPosts/RelatedPosts';
import { useDocumentTitle } from '../../lib/hooks/useDocumentTitle';
import { devError, devLog } from '../../lib/utils/devConsole';
import { truncateString } from '../../lib/utils/truncateStrings';

const Results = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useDocumentTitle(`Results for ${searchParams.get('term')} | FitClue`);

    const { searchResultLoadLimit, fetchPostsByString, fetchPostsByItemName, fetchPostsByBrandName, fetchPostByInstaLink, fetchPostsByContributionNumber } = usePosts();

    const categoryFromUrl = searchParams.get('category') || 'personality';
    const termFromUrl = searchParams.get('term') || '';

    const [searchTerm, setSearchTerm] = useState(termFromUrl);
    const [searchedTerm, setSearchedTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState(categoryFromUrl);

    const [results, setResults] = useState([]);
    const [resultsTotal, setResultsTotal] = useState(0);
    const [isResultsFirstBatchLoading, setIsResultsFirstBatchLoading] = useState(false);

    const [isMoreResultsLoading, setIsMoreResultsLoading] = useState(false);
    const [isSearchFunctionTriggered, setIsSearchFunctionTriggered] = useState(false);
    const [isOnLoadMoreResultsClicked, setIsOnLoadMoreResultsClicked] = useState(false);

    const [isNewTermSearched, setIsNewTermSearched] = useState(false);

    const [lastResult, setLastResult] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchAllPostsBySearchTerm = async (queryTerm, queryCategory, isNewSearch = false) => {

        if (isMoreResultsLoading || (!hasMore && !isNewSearch)) {
            return;
        }

        try {
            devLog('isNewSearch:', isNewSearch);
            devLog('queryTerm:', queryTerm);

            const cursor = isNewSearch ? null : lastResult;

            let searchResults = null;

            if (queryTerm === undefined) {
                return;
            }

            if (isNewSearch) {
                setSearchedTerm(queryTerm);
            }

            if (queryCategory === 'personality') {
                searchResults = await fetchPostsByString(queryTerm, cursor);
            }

            if (queryCategory === 'item') {
                const normalizedSearchTerm = queryTerm.toLocaleLowerCase();
                searchResults = await fetchPostsByItemName(normalizedSearchTerm, cursor);
            }

            if (queryCategory === 'brand') {
                const normalizedSearchTerm = queryTerm.toLocaleLowerCase();
                searchResults = await fetchPostsByBrandName(normalizedSearchTerm, cursor);
            }

            if (queryCategory === 'ig-link') {
                searchResults = await fetchPostByInstaLink(queryTerm);
            }

            if (queryCategory === 'needs-help') {
                searchResults = await fetchPostsByContributionNumber(0, 6, cursor);
            }

            devLog('searchResults', searchResults);

            const total = searchResults.total;
            const newDocuments = searchResults.rows;

            devLog('newDocuments', newDocuments);

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
            devError('Error loading more results:', error);
        } finally {
            setIsMoreResultsLoading(false);
        }
    }

    useEffect(() => {
        setSearchCategory(categoryFromUrl);
        setSearchTerm(termFromUrl);
        window.scrollTo(0, 0);

        const executeSearch = async () => {
            setIsResultsFirstBatchLoading(true);
            setResults([]);
            setLastResult(null);
            try {
                await fetchAllPostsBySearchTerm(termFromUrl, categoryFromUrl, true);
            } catch (error) {
                devError('Error fetching search results on URL change', error);
            } finally {
                setIsResultsFirstBatchLoading(false);
            }
        };

        executeSearch();
    }, [searchParams]);

    // fetches the results when searched in /search
    const onSearchTermSubmit = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim() && searchCategory !== 'needs-help') return;

        if (searchCategory === 'needs-help') {
            navigate('/search?category=needs-help');
        } else {
            navigate(
                `/search?category=${encodeURIComponent(searchCategory)}&term=${encodeURIComponent(searchTerm)}`
            );
        }
    };

    const onLoadMoreResultsClick = async () => {
        setIsOnLoadMoreResultsClicked(true);
        try {
            await fetchAllPostsBySearchTerm(termFromUrl, categoryFromUrl, false);
        } catch (error) {
            devError('Error onSearchTermSubmit', error);
        } finally {
            setIsOnLoadMoreResultsClicked(false);
        }
    }

    if (isResultsFirstBatchLoading) {
        return (
            <LoadingPage loadingText={`Loading results for ${searchTerm || searchParams.get('term')}`} />
        )
    }

    return (
        <Container
            style={{
                minHeight: 'calc(100vh - 112px)'
            }}
        >

            {/* Search container */}
            {
                searchCategory !== 'needs-help' ?
                    < RelatedPosts
                        headerText={
                            `Results for "${truncateString(searchedTerm, 15)}"`
                        }
                    >
                        <SearchComponent
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            onSubmit={onSearchTermSubmit}
                            setSearchCategory={setSearchCategory}
                            searchCategory={searchCategory}
                            resultsTotal={resultsTotal}
                            setResultsTotal={setResultsTotal}
                            searchParams={searchParams}
                        />
                    </RelatedPosts> :
                    <Row>
                        <Col className='my-4'>
                            <h5 className='text-uppercase'>
                                Needs your help
                            </h5>
                            <p className='mb-0'>
                                These posts have <span className=' text-black fw-bold'>no contributions yet</span>. Be the first to identify the item(s).
                            </p>
                        </Col>
                    </Row>
            }

            {/* Search results */}
            <Row>
                {
                    (isNewTermSearched) ? (
                        <LoadingComponent loadingText={`Loading results for ${searchTerm}`} className='mt-5' />
                    ) : results.length === 0 ? (
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
                                            isLoading={isOnLoadMoreResultsClicked}
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