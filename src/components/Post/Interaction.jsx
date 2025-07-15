import { useEffect, useState } from 'react';
import { usePosts } from '../../lib/hooks/usePosts';
import { Button, Col, Row } from 'react-bootstrap';
import { LoadingComponent } from '../Loading/Loading';

export const Interaction = ({ children, postId, userId }) => {

    const { createSave, fetchSavesByPostId, fetchUserSaveForPost, deleteSave } = usePosts();

    // Button states
    const [savesCount, setSavesCount] = useState(0);
    const [isShareClicked, setIsShareClicked] = useState(false);
    const [isPostSaved, setIsPostSaved] = useState(false);

    // Save
    const [isCreatingSave, setIsCreatingSave] = useState(false);
    const [savedDocId, setSavedDocId] = useState(null);

    // Fech total saves number
    useEffect(() => {
        const getSavesByPostId = async () => {
            try {
                const saves = await fetchSavesByPostId(postId);

                if (saves) {
                    console.log(saves);

                    setSavesCount(saves.total)

                }
            } catch (error) {
                console.error('Error getting saves by post id:', error);
            }
        };
        getSavesByPostId();
    }, [])

    useEffect(() => {
        const getUserSaveForPost = async () => {
            try {
                const res = await fetchUserSaveForPost(postId, userId);

                if (res) {
                    setSavedDocId(res.documents[0].$id);
                    setIsPostSaved(!!res);
                }
            } catch (error) {
                console.error('Error getting user save for post:', error);
            }
        };
        getUserSaveForPost();
    }, [])

    useEffect(() => {
        console.log('savedDocId:', savedDocId);
    }, [savesCount])

    const interactionButtons = [
        {
            name: 'Share',
            icon: 'bi bi-share',
            loadingComponent: null,
            isClicked: isShareClicked,
            func: () => { setIsShareClicked(preVal => !preVal) },
        },
        {
            name: !isPostSaved ? 'Save ' + savesCount : (!isCreatingSave && isPostSaved ? 'Saved ' + savesCount : ''),
            icon: !isPostSaved ? 'bi bi-floppy' : 'bi bi-floppy-fill',
            loadingComponent: isCreatingSave ? <LoadingComponent loadingText='Saving' /> : null,
            isClicked: isPostSaved,
            func: async () => {
                if (isPostSaved) {
                    console.log('Unsave function here.');
                    try {
                        await deleteSave(savedDocId);
                        setIsPostSaved(false);
                        setSavesCount(preVal => preVal - 1);
                        setSavedDocId(null);
                    } catch (error) {
                        console.error('Error deleting save:', error);
                    }
                } else {
                    setIsCreatingSave(true);
                    try {
                        const savedPost = await createSave(postId, userId);
                        if (savedPost) {
                            setIsPostSaved(true);
                            setSavedDocId(savedPost.$id);
                            setSavesCount(preVal => preVal + 1);
                        }
                    } catch (error) {
                        console.error('Error creating save:', error);
                    } finally {
                        setIsCreatingSave(false);
                    }
                }
            },
        },
        {
            name: 'Report',
            icon: 'bi bi-flag',
            loadingComponent: null,
            isClicked: false,
            func: () => { console.log(`Report is clicked.`); },
        },
    ]

    return (
        <>
            <div>
                <Row className='mx-auto'>
                    <Col className={`d-flex justify-content-evenly pt-4 ${!isShareClicked ? 'border border-bottom-1 border-top-0 border-start-0 border-end-0 pb-4' : ''}`}>
                        {
                            interactionButtons.map((button, idx) => {
                                return (
                                    <Button
                                        key={idx}
                                        onClick={button.func}
                                        className={`d-flex justify-content-center w-25 ${button.isClicked ? 'button-active' : ''}`}
                                    >
                                        <i className={`${button.icon} me-2`} />{' '}
                                        {button.loadingComponent ?? button.name}
                                        {button.actionCount}
                                    </Button>
                                )
                            })
                        }
                    </Col>
                </Row>
            </div>
            {isShareClicked && children}
        </>
    )
}
