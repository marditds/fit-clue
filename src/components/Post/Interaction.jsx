import { useEffect, useState } from 'react';
import { usePosts } from '../../lib/hooks/usePosts';
import { Button, Col, Row } from 'react-bootstrap';
import { LoadingComponent } from '../Loading/Loading';
import { ReportModal } from '../Modals/Modals';
import { TextTooltip, TextTooltipOnClick } from '../Accessories/CustomTooltip';
import { postReportCategories } from '../../lib/data/reportCategories';
import { Icon } from '../Accessories/Icon';

export const Interaction = ({ children, postId, userId, isLoggedIn }) => {

    const { createSave, fetchSavesByPostId, fetchUserSaveForPost, deleteSave, createPostReport } = usePosts();

    // Button states
    const [savesCount, setSavesCount] = useState(0);
    const [isPostSavedClicked, setIsPostSavedClicked] = useState(false);
    const [isShareClicked, setIsShareClicked] = useState(false);
    const [isReportClicked, setIsReportClicked] = useState(false);
    const [isPostSaved, setIsPostSaved] = useState(false);

    // Save
    const [isUpdatingSaveStatus, setIsUpdatingSaveStatus] = useState(false);
    const [isGettingSaveStatus, setIsGettingSaveStatus] = useState(false);
    const [savedDocId, setSavedDocId] = useState(null);

    // Report
    const [showModal, setShowModal] = useState(false);

    // Fech total saves number
    useEffect(() => {
        const getSavesByPostId = async () => {

            if (!postId) {
                return;
            }

            setIsGettingSaveStatus(true);

            try {
                const saves = await fetchSavesByPostId(postId);
                if (saves) {
                    setSavesCount(saves)
                }
            } catch (error) {
                console.error('Error getting saves by post id:', error);
            } finally {
                setIsGettingSaveStatus(false);
            }
        };
        getSavesByPostId();
    }, [])

    // Fech save status for one post
    useEffect(() => {
        const getUserSaveForPost = async () => {

            if (!userId) {
                return;
            }

            try {
                const res = await fetchUserSaveForPost(postId, userId);

                if (res) {
                    setSavedDocId(res.rows[0].$id);
                    setIsPostSaved(true);
                }
            } catch (error) {
                console.error('Error getting user save for post:', error);
            }
        };
        getUserSaveForPost();
    }, [userId])

    const removeSave = async () => {
        setIsUpdatingSaveStatus(true);
        try {
            await deleteSave(savedDocId);
            setIsPostSaved(false);
            setSavesCount(preVal => preVal - 1);
            setSavedDocId(null);
        } catch (error) {
            console.error('Error deleting save:', error);
        } finally {
            setIsUpdatingSaveStatus(false);
        }
    }

    const makeSave = async () => {
        setIsUpdatingSaveStatus(true);
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
            setIsUpdatingSaveStatus(false);
        }
    }

    const handleReportClick = () => {
        setIsReportClicked(true);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setIsReportClicked(false);
    };

    const onSubmitReportPost = async (selectedItemLinkId, reason) => {
        await createPostReport(selectedItemLinkId, reason);
    }

    const interactionButtons = [
        // {
        //     name: 'Share',
        //     icon: 'bi bi-share',
        //     loadingComponent: null,
        //     isClicked: isShareClicked,
        //     func: () => { setIsShareClicked(preVal => !preVal) },
        // },
        {
            name: !isPostSaved ? 'Save ' + '(' + savesCount + ')' : (!isUpdatingSaveStatus && isPostSaved ? 'Saved ' + '(' + savesCount + ')' : ''),
            icon: !isPostSaved ? 'bi bi-floppy' : 'bi bi-floppy-fill',
            loadingComponent: (isUpdatingSaveStatus || isGettingSaveStatus) ? <LoadingComponent loadingText=' ' /> : null,
            isClicked: isPostSaved,
            func: async () => {
                if (isLoggedIn) {
                    if (isPostSaved) {
                        await removeSave();
                    } else {
                        await makeSave();
                    }
                }
            },
        },
        {
            name: 'Report',
            icon: 'bi bi-flag',
            loadingComponent: null,
            isClicked: isReportClicked,
            func: () => {
                if (isLoggedIn) {
                    handleReportClick();
                }
            },
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
                                    <TextTooltip
                                        key={idx}
                                        tooltipText={!isLoggedIn ? 'Please sign in to perform this action.' : button.name}
                                    >
                                        <Button
                                            onClick={button.func}
                                            className={`d-flex justify-content-center interaction__btn ${isLoggedIn && button.isClicked ? 'button-active' : ''}`}
                                        >
                                            <Icon className={`${button.icon}`}
                                                marginEndSize={'2'}
                                            />
                                            {button.loadingComponent ?? button.name}
                                            {button.actionCount}
                                        </Button>
                                    </TextTooltip>
                                )
                            })
                        }
                    </Col>
                </Row>
            </div>
            {isShareClicked && children}

            <ReportModal
                itemId={postId}
                onClose={handleClose}
                reportCategories={postReportCategories}
                show={showModal}
                onSubmitReport={onSubmitReportPost}
            />

        </>
    )
}
