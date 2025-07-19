import { Col, Row } from 'react-bootstrap'
import { useOutletContext } from 'react-router-dom';
import { usePosts } from '../../../../lib/hooks/usePosts';
import { useEffect, useState } from 'react';
import { LoadingPage } from '../../../../components/Loading/Loading';
import { InstagramEmbedCards } from '../../../../components/Post/InstagramEmbedCards ';
import { LoadMoreButton } from '../../../../components/RelatedPosts/RelatedPosts';
import { Icon } from '../../../../components/Accessories/Icon';
import { ToastComponent } from '../../../../components/Accessories/ToastComponent';
import { savesDashboardData } from '../../../../lib/data/testData';

export const SavedPosts = () => {

    const { userId } = useOutletContext();

    const { fetchSavesByUserId, fetchInstaPostById, deleteSave, userSavesLoadLimit } = usePosts();

    const [lastSave, setLastSave] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [isSavesFirstBatchLoading, setIsSavesFirstBatchLoading] = useState(false);
    const [userSaves, setUserSaves] = useState([]);
    const [userSavesTotal, setUserSavesTotal] = useState(0);
    const [isSavesLoading, setIsSavesLoading] = useState(false);

    // Deletion
    const [loadingSaveDocId, setLoadingSaveDocId] = useState(null);

    //Toast
    const [showToast, setShowToast] = useState(false);

    const getSavesByPostId = async () => {

        if (!userId) {
            return;
        }

        setIsSavesLoading(true);

        try {
            const userSavesDocs = await fetchSavesByUserId(userId, lastSave || null);

            if (!userSavesDocs || !userSavesDocs.documents?.length) {
                console.log('No saves found.');
                setHasMore(false);
                return;
            }

            setUserSavesTotal(userSavesDocs.total);

            const usrSvsDcs = userSavesDocs.documents;

            console.log(`usrSvsDcs:`, usrSvsDcs);

            const fetchedInstaPosts = await Promise.all(
                usrSvsDcs.map(async (usrSv) => {
                    const post = await fetchInstaPostById(usrSv.post_id);
                    return {
                        post,
                        saveDocId: usrSv.$id,
                    };
                })
            );

            console.log(`fetchedInstaPosts:`, fetchedInstaPosts);

            if (lastSave === null) {
                setUserSaves(fetchedInstaPosts);
            } else {
                setUserSaves(prevRes => [...prevRes, ...fetchedInstaPosts]);
            }

            setLastSave(usrSvsDcs[usrSvsDcs.length - 1].$id || null);

            setHasMore(usrSvsDcs.length === userSavesLoadLimit);

            if (usrSvsDcs.length < userSavesLoadLimit) {
                setHasMore(false);
            }

            // Uncomment below for test data
            // const instaPosts = savesDashboardData; 
            // setUserSaves([]);
            // setHasMore(false);
            // setUserSavesTotal(0);

        } catch (error) {
            console.error('Error getting saves:', error);
        } finally {
            setIsSavesLoading(false);
        }
    }

    useEffect(() => {
        console.log('userSaves:', userSaves);
    }, [userSaves])

    useEffect(() => {
        const loadingSavesFirstBatch = async () => {
            console.log('Loading first batch of saves.');

            setIsSavesFirstBatchLoading(true);
            try {
                await getSavesByPostId();
            } catch (error) {
                console.error('Error loading saves.', error);
            } finally {
                setIsSavesFirstBatchLoading(false);
            }
        }
        setUserSaves([]);
        setLastSave(null);
        loadingSavesFirstBatch();
    }, [])

    const onLoadMoreSavesClick = async () => {
        await getSavesByPostId();
    }

    const onDeleteSaveClick = async (saveDocIdToDelete) => {

        setLoadingSaveDocId(saveDocIdToDelete);

        try {
            await deleteSave(saveDocIdToDelete);

            setUserSaves((prevSaves) =>
                prevSaves.filter((item) => item.saveDocId !== saveDocIdToDelete)
            );

            setUserSavesTotal(prevTotal => prevTotal - 1);

            setShowToast(true);
        } catch (error) {
            console.error('Failed to delete save:', error);
        } finally {
            setLoadingSaveDocId(null);
        }
    };


    if (isSavesFirstBatchLoading) {
        return (
            <LoadingPage loadingText='Loading your saves' />
        )
    }

    return (
        <>
            <Row className='px-4 pt-4 pb-0 px-lg-5 pt-lg-5 pb-lg-0'>
                <Col className=''>
                    <h3 className='fw-bold'>
                        <Icon className='bi bi-floppy me-3' />Your Saves ({userSavesTotal})
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
                        <p>You saved posts will appear here.</p>
                    )
                }
            </Row>

            <Row>
                <Col>
                    <LoadMoreButton
                        isLoading={isSavesLoading}
                        hasMore={hasMore}
                        onClick={onLoadMoreSavesClick}
                        loadMoreText='Load more saves'
                        loadingText='Loading more saves'
                        noMoreText='No more saves'
                        className='w-100'
                    />
                </Col>
            </Row>

            {/* Toast */}
            <ToastComponent
                showToast={showToast}
                setShowToast={setShowToast}
                toastTitle='Save Removed Successfully.'
            />
        </>
    )
}
