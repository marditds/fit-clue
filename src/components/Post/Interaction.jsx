import { useEffect, useState } from 'react';
import { usePosts } from '../../lib/hooks/usePosts';
import { Button, Col, Row } from 'react-bootstrap';
import { LoadingComponent } from '../Loading/Loading';
import { ReportModal } from '../Modals/Modals';
import { reportCategories } from '../../lib/data/reportCategories';

export const Interaction = ({ children, postId, userId }) => {

    const { createSave, fetchSavesByPostId, fetchUserSaveForPost, deleteSave } = usePosts();

    // Button states
    const [savesCount, setSavesCount] = useState(0);
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

    // Fech saves
    useEffect(() => {
        const getUserSaveForPost = async () => {

            if (!userId) {
                return;
            }

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
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedItem(null);
    };

    const onSubmitReportLinkClick = async (selectedItemLinkId, reason) => {
        await createReportLink(selectedItemLinkId, reason);
    }

    const interactionButtons = [
        {
            name: 'Share',
            icon: 'bi bi-share',
            loadingComponent: null,
            isClicked: isShareClicked,
            func: () => { setIsShareClicked(preVal => !preVal) },
        },
        {
            name: !isPostSaved ? 'Save ' + savesCount : (!isUpdatingSaveStatus && isPostSaved ? 'Saved ' + savesCount : ''),
            icon: !isPostSaved ? 'bi bi-floppy' : 'bi bi-floppy-fill',
            loadingComponent: (isUpdatingSaveStatus || isGettingSaveStatus) ? <LoadingComponent loadingText=' ' /> : null,
            isClicked: isPostSaved,
            func: async () => {
                if (isPostSaved) {
                    await removeSave();
                } else {
                    await makeSave();
                }
            },
        },
        {
            name: 'Report',
            icon: 'bi bi-flag',
            loadingComponent: null,
            isClicked: isReportClicked,
            func: () => {
                console.log(`Report is clicked.`);
                handleReportClick();
            },
        },
    ]

    return (
        <>
            <div>
                <Row className='mx-auto'>
                    <Col className={`d-flex justify-content-around pt-4 ${!isShareClicked ? 'border border-bottom-1 border-top-0 border-start-0 border-end-0 pb-4' : ''}`}>
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

            <ReportModal
                itemId={postId}
                onClose={handleClose}
                reportCategories={reportCategories}
                show={showModal}
                onSubmitReport={onSubmitReportLinkClick}
            />

        </>
    )
}
