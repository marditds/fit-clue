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

    //Toast
    const [showToast, setShowToast] = useState(false);

    const getMyPosts = async () => {

        console.log({ userId: userId, lastMyPost: lastMyPost });

        if (!userId) {
            console.log('User is not found. Stop fetching my posts.');
            return;
        }

        setIsMyPostsLoading(true);

        try {
            const myPostsDocs = await fetchPostsByCreatorId(userId, lastSave || null);

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
                            className='bi bi-floppy'
                            marginEndSize={'3'}
                        />Your Saves ({userSavesTotal})
                    </h3>
                    <p>
                        Here is where your saved posts live.
                    </p>
                </Col>
            </Row>

            <Row className='px-4 pb-0 px-lg-5 pb-lg-0' xs={1}>
                {userSaves?.length > 0 ?
                    (
                        userSaves.map((savedPost) => {
                            return (
                                <InstagramEmbedCards
                                    key={savedPost.saveDocId}
                                    posts={[savedPost.post]}
                                    saveDocId={savedPost.saveDocId}
                                    onDeleteSaveClick={onDeleteSaveClick}
                                    isDeleteSaveLoading={loadingSaveDocId === savedPost.saveDocId}
                                />
                            );
                        })
                    ) : (
                        <p className='px-0'>You saved posts will appear here.</p>
                    )
                }
            </Row>

            <Row>
                <Col>
                    <LoadMoreButton
                        isLoading={isSavesLoading}
                        hasMore={hasMore}
                        onClick={onLoadMoreMyPostsClick}
                        loadMoreText='Load more saves'
                        loadingText='Loading more saves'
                        noMoreText='No more saves'
                        className='w-100 mt-2'
                    />
                </Col>
            </Row>

            {/* Toast */}
            <ToastForDashboard
                showToast={showToast}
                setShowToast={setShowToast}
                toastTitle='Save Removed Successfully.'
            />
        </>
    )
}
