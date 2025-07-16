import { Col, Row } from 'react-bootstrap'
import { useOutletContext } from 'react-router-dom';
import { usePosts } from '../../../../lib/hooks/usePosts';
import { useEffect, useState } from 'react';
import { LoadingPage } from '../../../../components/Loading/Loading';
import { InstagramEmbedCards } from '../../../../components/Post/InstagramEmbedCards ';

export const SavedPosts = () => {

    const { userId, username } = useOutletContext();

    const { fetchSavesByUserId, fetchInstaPostById } = usePosts();


    const [userSaves, setUserSaves] = useState([]);
    const [userSavesTotal, setUserSavesTotal] = useState([]);
    const [isSavesLoading, setIsSavesLoading] = useState(false);

    useEffect(() => {
        const getSavesByPostId = async () => {

            if (!userId) {
                return;
            }

            setIsSavesLoading(true);
            try {
                const userSaves = await fetchSavesByUserId(userId);

                console.log(`userSaves by ${username}:`, userSaves);

                const instaPosts = await Promise.all(
                    userSaves.documents.map((usrSvs) => fetchInstaPostById(usrSvs.post_id))
                );

                console.log(`instaPosts by ${username}:`, instaPosts);

                setUserSaves(instaPosts);

                setUserSavesTotal(userSaves.total);

            } catch (error) {
                console.error('Error getting saves:', error);
            } finally {
                setIsSavesLoading(false);
            }
        }
        getSavesByPostId();
    }, [])

    if (isSavesLoading) {
        return (
            <LoadingPage loadingText='Loading your saves' />
        )
    }

    return (
        <Col>
            <Row>
                <Col>
                    SavedPosts
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
