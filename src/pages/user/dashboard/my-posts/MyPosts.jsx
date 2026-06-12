import { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import { usePosts } from '../../../../lib/hooks/usePosts';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { LoadingPage } from '../../../../components/Loading/Loading';
import { InstagramEmbedCards } from '../../../../components/Post/InstagramEmbedCards ';
import { LoadMoreButton } from '../../../../components/RelatedPosts/RelatedPosts';
import { Icon } from '../../../../components/Accessories/Icon';
import { ToastForDashboard } from '../../../../components/Accessories/ToastComponent';
import { useDocumentTitle } from '../../../../lib/hooks/useDocumentTitle';

export const MyPosts = () => {

    useDocumentTitle('My Posts | FitClue');

    const { userId } = useOutletContext();

    const queryClient = useQueryClient();

    const { fetchPostsByCreatorId, myPostsLoadLimit } = usePosts();

    useEffect(() => {
        if (!userId) return;
        const state = queryClient.getQueryState(['myPosts', userId]);
        const isStale = state && Date.now() - (state.dataUpdatedAt ?? 0) > 120_000;
        if (isStale) {
            queryClient.resetQueries({ queryKey: ['myPosts', userId] });
        }
    }, [userId]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isLoading: isMyPostsFirstBatchLoading,
    } = useInfiniteQuery({
        queryKey: ['myPosts', userId],
        queryFn: ({ pageParam = null }) => fetchPostsByCreatorId(userId, pageParam),
        getNextPageParam: (lastPage) => {
            if (!lastPage?.rows?.length || lastPage.rows.length < myPostsLoadLimit) {
                return undefined;
            }
            return lastPage.rows[lastPage.rows.length - 1].$id;
        },
        enabled: !!userId,
        staleTime: 120_000,
    });

    const myPosts = data?.pages?.flatMap(page => page?.rows ?? []) ?? [];
    const myPostsTotal = data?.pages[0]?.total ?? 0;
    const isMyPostsLoading = isFetching;
    const hasMore = hasNextPage ?? false;

    const onLoadMoreMyPostsClick = () => fetchNextPage();

    if (isMyPostsFirstBatchLoading) {
        return (
            <LoadingPage loadingText='Loading your saves' />
        )
    }

    return (
        <>
            <Row className='px-4 pt-4 pb-0 px-lg-5 pt-lg-5 pb-lg-0'>
                <Col className='px-0'>
                    <h3 className='fw-bold'>
                        <Icon
                            className='bi bi-file-earmark-post'
                            marginEndSize={'3'}
                        />
                        Your Posts ({myPostsTotal})
                    </h3>
                    <p>
                        Here is where your posts live.
                    </p>
                </Col>
            </Row>

            <Row className='px-4 pb-0 px-lg-5 pb-lg-0' xs={1}>
                {myPosts.length > 0 ? (
                    myPosts.map((myPost) => (
                        <InstagramEmbedCards
                            key={myPost.$id}
                            posts={[myPost]}
                        />
                    ))
                ) : (
                    <p className='px-0'>Your posts will appear here.</p>
                )}
            </Row>

            <Row>
                <Col>
                    <LoadMoreButton
                        isLoading={isMyPostsLoading}
                        hasMore={!!hasNextPage}
                        onClick={onLoadMoreMyPostsClick}
                        loadMoreText='Load more posts'
                        loadingText='Loading more posts'
                        noMoreText='No more posts'
                        className='w-100 mt-2'
                    />
                </Col>
            </Row>

            <ToastForDashboard
                disabled={true}
                showToast={false}
            />
        </>
    );
};