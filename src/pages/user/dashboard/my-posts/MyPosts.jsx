import { Col, Row } from 'react-bootstrap'
import { useOutletContext } from 'react-router-dom';
import { usePosts } from '../../../../lib/hooks/usePosts';
import { useEffect, useState } from 'react';
import { LoadingPage } from '../../../../components/Loading/Loading';
import { InstagramEmbedCards } from '../../../../components/Post/InstagramEmbedCards ';
import { LoadMoreButton } from '../../../../components/RelatedPosts/RelatedPosts';
import { Icon } from '../../../../components/Accessories/Icon';
import { ToastForDashboard } from '../../../../components/Accessories/ToastComponent';
import { savesDashboardData } from '../../../../lib/data/testData';

export const MyPosts = () => {

    const { userId } = useOutletContext();

    const { fetchPostsByCreatorId, fetchInstaPostById, myPostsLoadLimit } = usePosts();

    const [lastMyPost, setLastMyPost] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [isMyPostsFirstBatchLoading, setIsMyPostsFirstBatchLoading] = useState(false);
    const [myPosts, setMyPosts] = useState([]);
    const [myPostsTotal, setMyPostsTotal] = useState(0);
    const [isMyPostsLoading, setIsMyPostsLoading] = useState(false);

    const getMyPosts = async () => {

        console.log({ userId: userId, lastMyPost: lastMyPost });

        if (!userId) {
            console.log('User is not found. Stop fetching my posts.');
            return;
        }

        setIsMyPostsLoading(true);

        try {
            const myPostsDocs = await fetchPostsByCreatorId(userId, lastMyPost || null);

            if (!myPostsDocs || !myPostsDocs.rows?.length) {
                console.log('No posts found.');
                setHasMore(false);
                return;
            }

            setMyPostsTotal(myPostsDocs.total);

            const myPstsDcs = myPostsDocs.rows;

            console.log(`myPstsDcs:`, myPstsDcs);

            // const fetchedInstaPosts = await Promise.all(
            //     myPstsDcs.map(async (usrSv) => {
            //         const post = await fetchInstaPostById(usrSv.user_id);
            //         return {
            //             post,
            //             saveDocId: usrSv.$id,
            //         };
            //     })
            // );

            if (lastMyPost === null) {
                setMyPosts(myPstsDcs);
            } else {
                setMyPosts(prevRes => [...prevRes, ...myPstsDcs]);
            }

            setLastMyPost(myPstsDcs[myPstsDcs.length - 1].$id || null);

            setHasMore(myPstsDcs.length === myPostsLoadLimit);

            if (myPstsDcs.length < myPostsLoadLimit) {
                setHasMore(false);
            }

        } catch (error) {
            console.error('Error getting my posts:', error);
        } finally {
            setIsMyPostsLoading(false);
        }
    }

    useEffect(() => {
        console.log('myPosts:', myPosts);
    }, [myPosts])

    useEffect(() => {
        const loadingMyPostsFirstBatch = async () => {
            console.log('Loading first batch of my posts.');

            setIsMyPostsFirstBatchLoading(true);
            try {
                await getMyPosts();
            } catch (error) {
                console.error('Error loading my posts.', error);
            } finally {
                setIsMyPostsFirstBatchLoading(false);
            }
        }
        setMyPosts([]);
        setLastMyPost(null);
        loadingMyPostsFirstBatch();
    }, [userId])

    const onLoadMoreMyPostsClick = async () => {
        await getMyPosts();
    }

    if (isMyPostsFirstBatchLoading) {
        return (
            <LoadingPage loadingText='Loading my posts' />
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
                        />Your Posts ({myPostsTotal})
                    </h3>
                    <p>
                        Here is where your posts live.
                    </p>
                </Col>
            </Row>

            <Row className='px-4 pb-0 px-lg-5 pb-lg-0' xs={1}>
                {myPosts?.length > 0 ?
                    (
                        myPosts.map((myPost) => {
                            return (
                                <InstagramEmbedCards
                                    key={myPost.$id}
                                    posts={[myPost]}
                                />
                            );
                        })
                    ) : (
                        <p className='px-0'>You posts will appear here.</p>
                    )
                }
            </Row>

            <Row>
                <Col>
                    <LoadMoreButton
                        isLoading={isMyPostsLoading}
                        hasMore={hasMore}
                        onClick={onLoadMoreMyPostsClick}
                        loadMoreText='Load more posts'
                        loadingText='Loading more posts'
                        noMoreText='No more posts'
                        className='w-100 mt-2'
                    />
                </Col>
            </Row>
        </>
    )
}
