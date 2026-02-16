import { useEffect, useState } from 'react'
import { usePosts } from '../../lib/hooks/usePosts';
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { InstagramEmbedCards } from '../../components/Post/InstagramEmbedCards ';
import { LoadingComponent, LoadingPage } from '../../components/Loading/Loading';
import { ScrollToTop } from '../../components/ScrollToTop/ScrollToTop';
import { SearchComponent } from '../../components/Form/SearchForm';
import { LoadMoreButton, RelatedPosts } from '../../components/RelatedPosts/RelatedPosts';

const Results = () => {

    const params = useParams();

    const navigate = useNavigate();

    const { searchResultLoadLimit, fetchPostsByString, fetchPostsByItemName, fetchPostsByBrandName } = usePosts();

    const [searchTerm, setSearchTerm] = useState(params.term);
    const [searchCategory, setSearchCategory] = useState(params.category);

    const [results, setResults] = useState([]);
    const [cachedLinksIds, setCachedLinksIds] = useState([]);
    const [resultsTotal, setResultsTotal] = useState(0);
    const [isResultsFirstBatchLoading, setIsResultsFirstBatchLoading] = useState(false);

    const [isMoreResultsLoading, setIsMoreResultsLoading] = useState(false);
    const [isOnLoadMoreResultsClicked, setIsOnLoadMoreResultsClicked] = useState(false);

    const [isNewTermSearched, setIsNewTermSearched] = useState(false);

    const [lastResult, setLastResult] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchAllPostsBySearchTerm = async (isNewSearch = false) => {

        if (isMoreResultsLoading || (!hasMore && !isNewSearch)) {
            return;
        }

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

            if (searchCategory === 'brand') {
                const normalizedSearchTerm = searchTerm.toLocaleLowerCase();

                console.log('normalizedSearchTerm:', normalizedSearchTerm);
                console.log('cachedLinksIds:', cachedLinksIds);

                searchResults = await fetchPostsByBrandName(normalizedSearchTerm, cursor, cachedLinksIds);

                console.log('searchResults:', searchResults);

                if (isNewSearch) {
                    setCachedLinksIds(searchResults.linksIds);
                }
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
            setIsMoreResultsLoading(false);
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [isNewTermSearched]);

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
        setCachedLinksIds([]);
        setIsNewTermSearched(true);
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
            setIsNewTermSearched(false);
        }
    }

    const onLoadMoreResultsClick = async () => {
        setIsOnLoadMoreResultsClicked(true);
        try {
            await fetchAllPostsBySearchTerm(false);
        } catch (error) {
            console.error('Error onSearchTermSubmit', error);
        } finally {
            setIsOnLoadMoreResultsClicked(false);
        }
    }

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

            {/* Search container */}
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
            </RelatedPosts>

            {/* Search results */}
            <Row>
                {
                    results.length === 0 ? (
                        null
                    ) : (
                        <>
                            {!isNewTermSearched ?
                                <> <InstagramEmbedCards posts={results} />
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
                                </> :
                                <LoadingComponent loadingText={`Loading results for ${searchTerm}`} className='mt-5' />
                            }
                        </>
                    )
                }
            </Row>

            <ScrollToTop />

        </Container>
    )
}

export default Results; 