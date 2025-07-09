import { useEffect, useState } from 'react';
import { usePosts } from '../../lib/hooks/usePosts';
import { Button, Col, Row } from 'react-bootstrap';
import { LoadingComponent } from '../Loading/LoadingComponent';
import { dateTimeFormatter } from '../../lib/utils/dateTimeFormatter';
import { ReportModal } from '../Modals/Modals';
import { commentReportCategories } from '../../lib/data/reportCategories';
import { TextTooltip } from '../ToolTip/CustomTooltip';
import { onePostComments } from '../../lib/data/testData';

export const PostedComments = ({ postId, isViewCommentsClicked, setIsViewCommentsClicked, isLoggedIn }) => {

    const { comments, commentsLoadLimit, setComments, fetchComments, createReportComment } = usePosts();

    // Fetching comments
    const [lastComment, setLastComment] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [isCommentsFirstBatchLoading, setIsCommentsFirstBatchLoading] = useState(false);
    const [isCommentsLoading, setIsCommentsLoading] = useState(false);

    // Report Comment 
    const [selectedComment, setSelectedComment] = useState(null);
    const [show, setShow] = useState(false);

    const getCommentsByPostId = async () => {

        if (!isViewCommentsClicked) {
            return;
        }
        try {
            setIsCommentsLoading(true);

            // To be commented out when testing real data
            // setComments(onePostComments);

            const res = await fetchComments(postId, lastComment?.$id || null);
            // console.log('res:', res);

            setLastComment(res[res.length - 1] || null);
            setHasMore(res.length === commentsLoadLimit);

            if (res.length < commentsLoadLimit) {
                {
                    setHasMore(false);
                }
            }

        } catch (error) {
            console.error('Error getting comments:', error);
        } finally {
            setIsCommentsLoading(false);
        }
    }

    // Load the comments on isViewCommentsClicked
    useEffect(() => {
        const loadingCommentsFirstBatch = async () => {
            setIsCommentsFirstBatchLoading(true);
            try {
                await getCommentsByPostId();
            } catch (error) {
                console.error('Error loading comments.');
            } finally {
                setIsCommentsFirstBatchLoading(false);
            }
        }
        loadingCommentsFirstBatch();
    }, [isViewCommentsClicked])

    const onLoadMoreCommentsClick = async () => {
        await getCommentsByPostId();
    }

    const onViewCommentsClick = () => {
        setIsViewCommentsClicked(preVal => !preVal)
    }

    const handleReportClick = (item) => {
        setSelectedComment(item);
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
        setSelectedComment(null);
    };

    const handleSubmitReport = async (commentId, reason) => {
        await createReportComment(commentId, reason);
    };

    return (
        <Row className='d-flex flex-column justify-content-center mx-auto'>
            <Col className='sticky-top px-0'>
                {
                    !isLoggedIn ?
                        <TextTooltip tooltipText='Please sign in to view comments'>
                            <Button
                                type='button'
                                className='sticky-top mb-3 w-100'
                            >
                                View Comments
                            </Button>
                        </TextTooltip> :
                        <Button
                            onClick={onViewCommentsClick}
                            className='sticky-top mb-3 w-100'
                        >
                            {isViewCommentsClicked ? 'Hide' : 'View'} Comments
                        </Button>
                }

            </Col>

            {isViewCommentsClicked && (
                <Col className='px-0'>
                    {isCommentsFirstBatchLoading ? (
                        <LoadingComponent />
                    ) : (
                        <>
                            {comments?.length > 0 ? (
                                comments.map((comment, idx) => (
                                    <div key={idx}>
                                        <Row className='justify-content-center align-items-center'>
                                            <Col className='d-flex justify-content-start align-items-baseline'>
                                                <strong className='me-2'>
                                                    {comment.username || 'Deleted user'}
                                                </strong>

                                                <small>{dateTimeFormatter(comment.$createdAt)}</small>
                                            </Col>
                                            <Col className='d-flex justify-content-end'>
                                                <Button
                                                    onClick={() => handleReportClick(comment)}
                                                    className='py-1 px-2 bg-transparent text-muted'
                                                >
                                                    <small>
                                                        <i className='bi bi-flag' /> Report
                                                    </small>
                                                </Button>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className='text-wrap text-break'>
                                                {comment.comment_text}
                                            </Col>
                                        </Row>
                                        <hr />
                                    </div>
                                ))
                            ) : (
                                <p>
                                    Be the first to share your thoughts!
                                </p>
                            )}

                            <Button
                                className='w-100'
                                onClick={onLoadMoreCommentsClick}
                                disabled={!hasMore}
                            >
                                {hasMore ? (
                                    !isCommentsLoading ? 'Load more comments' : <LoadingComponent />
                                ) : (
                                    'No more comments'
                                )}
                            </Button>
                        </>
                    )}
                </Col>
            )}

            <ReportModal
                show={show}
                onClose={handleClose}
                item={selectedComment}
                reportCategories={commentReportCategories}
                onSubmitReport={handleSubmitReport}
            />

        </Row>
    )
}
