import { Col, Row } from 'react-bootstrap'
import { useOutletContext } from 'react-router-dom';
import { usePosts } from '../../../../lib/hooks/usePosts';
import { useEffect, useState } from 'react';
import { LoadingPage } from '../../../../components/Loading/Loading';
import { InstagramEmbedCards } from '../../../../components/Post/InstagramEmbedCards ';
import { savesDashboardData } from '../../../../lib/data/testData';
import { LoadMoreButton } from '../../../../components/RelatedPosts/RelatedPosts';

export const SavedPosts = () => {

    const { userId, username } = useOutletContext();

    const { fetchSavesByUserId, fetchInstaPostById, deleteSave, userSavesLoadLimit } = usePosts();

    const [lastSave, setLastSave] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [isSavesFirstBatchLoading, setIsSavesFirstBatchLoading] = useState(false);
    const [userSaves, setUserSaves] = useState([]);
    const [userSavesTotal, setUserSavesTotal] = useState([]);
    const [isSavesLoading, setIsSavesLoading] = useState(false);

    let instaPosts = [];

    const getSavesByPostId = async () => {

        if (!userId || !hasMore) {
            return;
        }

        setIsSavesLoading(true);

        try {
            const userSaves = await fetchSavesByUserId(userId, lastSave || null);

            setUserSavesTotal(userSaves.total);

            const userSavesDocs = userSaves.documents;

            console.log(`userSaves by ${username}:`, userSaves);

            instaPosts = await Promise.all(
                userSavesDocs.map((usrSvs) => fetchInstaPostById(usrSvs.post_id))
            );

            // console.log(`instaPosts by ${username}:`, instaPosts);

            setUserSaves(prevInstaPosts => [...prevInstaPosts, ...instaPosts]);

            setLastSave(userSavesDocs[userSavesDocs.length - 1].$id || null);

            if (userSavesDocs.length < userSavesLoadLimit) {
                setHasMore(false);
            }

            // const instaPosts = savesDashboardData;

            // setUserSaves(instaPosts);
            // setUserSavesTotal(instaPosts.length);

        } catch (error) {
            console.error('Error getting saves:', error);
        } finally {
            setIsSavesLoading(false);
        }
    }

    useEffect(() => {
        console.log('instaPosts in useEffect:', instaPosts);
    }, [instaPosts])

    useEffect(() => {
        console.log('userSaves in useEffect:', userSaves);
    }, [userSaves])

    useEffect(() => {
        const loadingSavesFirstBatch = async () => {
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

    if (isSavesFirstBatchLoading) {
        return (
            <LoadingPage loadingText='Loading your saves' />
        )
    }

    return (
        <Col className='border'>
            <Row>
                <Col className='px-4 pt-4 pb-0 px-lg-5 pt-lg-5 pb-lg-0'>
                    <h3 className='fw-bold'>
                        Your Saves ({userSavesTotal})
                    </h3>
                    <p>
                        Here is where your saved posts live.
                    </p>
                </Col>
            </Row>

            <Row>
                {userSaves?.length > 0 ?
                    (<InstagramEmbedCards
                        posts={userSaves}
                    />) : (
                        <p>You saved posts well appear here.</p>
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
        </Col>
    )
}
