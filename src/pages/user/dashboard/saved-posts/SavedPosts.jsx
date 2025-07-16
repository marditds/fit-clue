import { Col, Row } from 'react-bootstrap'
import { useOutletContext } from 'react-router-dom';
import { usePosts } from '../../../../lib/hooks/usePosts';
import { useEffect, useState } from 'react';
import { LoadingPage } from '../../../../components/Loading/Loading';
import { InstagramEmbedCards } from '../../../../components/Post/InstagramEmbedCards ';
import { savesDashboardData } from '../../../../lib/data/testData';

export const SavedPosts = () => {

    const { userId, username } = useOutletContext();

    const { fetchSavesByUserId, fetchInstaPostById, deleteSave, userSavesLoadLimit } = usePosts();

    const [lastSave, setLastSave] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [isSavesBatchLoading, setIsSavesFirstBatchLoading] = useState(false);
    const [userSaves, setUserSaves] = useState([]);
    const [userSavesTotal, setUserSavesTotal] = useState([]);
    const [isSavesLoading, setIsSavesLoading] = useState(false);

    const getSavesByPostId = async () => {

        if (!userId || !hasMore) {
            return;
        }

        setIsSavesLoading(true);

        try {
            const userSaves = await fetchSavesByUserId(userId, lastSave || null);

            setUserSavesTotal(userSaves.total);

            console.log(`userSaves by ${username}:`, userSaves);

            const instaPosts = await Promise.all(
                userSaves.documents.map((usrSvs) => fetchInstaPostById(usrSvs.post_id))
            );

            setUserSaves(prev => [...prev, ...instaPosts]);

            const lastDoc = userSaves.documents[userSaves.documents.length - 1];
            setLastSave(lastDoc?.$id || null);

            // Determine if there's more to fetch
            if (userSaves.documents.length < userSavesLoadLimit) {
                setHasMore(false);
            }

            console.log(`instaPosts by ${username}:`, instaPosts);

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

    if (isSavesLoading) {
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
                <InstagramEmbedCards
                    posts={userSaves}
                />
            </Row>
        </Col>
    )
}
