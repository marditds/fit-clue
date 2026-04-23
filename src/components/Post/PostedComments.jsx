import { useEffect, useState } from 'react';
import { usePosts } from '../../lib/hooks/usePosts';
import { Button, Col, Row } from 'react-bootstrap';
import { LoadingComponent } from '../Loading/Loading';
import { dateTimeFormatter } from '../../lib/utils/dateTimeFormatter';
import { ReportModal } from '../Modals/Modals';
import { commentReportCategories } from '../../lib/data/reportCategories';
import { TextTooltip } from '../Accessories/CustomTooltip';
import { LoadMoreButton } from '../RelatedPosts/RelatedPosts';
import { Icon } from '../Accessories/Icon';

export const PostedComments = ({ postId, comments, setComments, commentsTotal, setCommentsTotal, isViewCommentsClicked, setIsViewCommentsClicked, isLoggedIn }) => {

    const { commentsLoadLimit, fetchComments, createReportComment } = usePosts();

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

            const res = await fetchComments(postId, lastComment?.$id || null);

            const commentsDocs = res.rows;
            const commentsTotal = res.total;

            setCommentsTotal(commentsTotal);

            setComments((prevComments) => [...(prevComments || []), ...(commentsDocs || [])].flat());

            if (res?.length === 0) {
                setCommentsTotal(0);
            }

            if (res?.length === 0 || commentsDocs.length === commentsTotal) {
                setHasMore(false);
                return;
            }

            setLastComment(commentsDocs[commentsDocs.length - 1] || null);
            setHasMore(commentsDocs.length === commentsLoadLimit);

            if (commentsDocs.length < commentsLoadLimit) {
                setHasMore(false);
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
        setIsViewCommentsClicked(true)
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
            <Col className='sticky-top px-0 bg-white'>
                {
                    !isLoggedIn ? (
                        <TextTooltip tooltipText='Please sign in to view comments.'>
                            <Button
                                type='button'
                                className='sticky-top mb-3 w-100'
                            >
                                View Comments
                            </Button>
                        </TextTooltip>
                    ) : !isViewCommentsClicked ? (
                        <Button
                            onClick={onViewCommentsClick}
                            className='sticky-top mb-3 w-100'
                        >
                            View Comments
                        </Button>
                    ) : null
                }

                {isViewCommentsClicked && !isCommentsFirstBatchLoading &&
                    <h4>
                        <Icon
                            className='bi bi-chat-left'
                            marginEndSize={'2'}
                        />Comments ({commentsTotal})
                    </h4>
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
                                                        <Icon className='bi bi-flag' marginEndSize={'2'} />Report
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

                            <LoadMoreButton
                                isLoading={isCommentsLoading}
                                hasMore={hasMore}
                                onClick={onLoadMoreCommentsClick}
                                loadMoreText='Load more comments'
                                loadingText='Loading more comments'
                                noMoreText='No more comments'
                                className='w-100'
                            />
                        </>
                    )}
                </Col>
            )}

            <ReportModal
                show={show}
                onClose={handleClose}
                itemId={selectedComment?.$id}
                reportCategories={commentReportCategories}
                onSubmitReport={handleSubmitReport}
            />

        </Row>
    )
}
