import React, { useEffect, useState } from 'react';
import { Button, Col, Dropdown, DropdownButton, Form, Row } from 'react-bootstrap';
import { LoadingComponent } from '../Loading/LoadingComponent';
import { dateTimeFormatter } from '../../lib/utils/dateTimeFormatter';
import { usePosts } from '../../lib/hooks/usePosts';
import { useGemini } from '../../lib/hooks/useGemini';
import { onePostComments } from '../../lib/data/testData';
import { ReportModal } from '../Modals/Modals';
import { commentReportCategories } from '../../lib/data/reportCategories';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import { TextTooltip } from '../ToolTip/CustomTooltip';

export const CommentSection = ({ postId, username, userId, isLoggedIn }) => {

    const { comments, commentsLoadLimit, setComments, createComment, fetchComments, createReportComment } = usePosts();

    const { isRunningGemini, runGemini } = useGemini();

    const { isXs, isSm, isMd } = useBreakpoints();

    //Fetching comments 
    const [lastComment, setLastComment] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    // Leaving a comment
    const [commentText, setCommentText] = useState('');
    const [commentSuccessMessage, setCommentSuccessMessage] = useState('');
    const [commentErrorMessage, setCommentErrorMessage] = useState('');
    const [isAddningComment, setIsAddingComment] = useState(false);
    const [isViewCommentsClicked, setIsViewCommentsClicked] = useState(false);
    const [isCommentsLoading, setIsCommentsLoading] = useState(false);
    const [isCommentsFirstBatchLoading, setIsCommentsFirstBatchLoading] = useState(false);

    // Gemini Results
    const [geminiResult, setGeminiResult] = useState('');

    // Report Comment 
    const [selectedComment, setSelectedComment] = useState(null);
    const [show, setShow] = useState(false);

    // Get the comments for post
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


    const onCreateCommentSubmit = async (e) => {

        e.preventDefault();

        try {
            setIsAddingComment(true);

            const geminiRes = await runGemini(commentText);

            if (geminiRes.trim().toLowerCase() !== 'ok') {
                setGeminiResult(geminiRes);
                setCommentText('');
                setCommentSuccessMessage('');
                return;
            };

            const newComment = await createComment(postId, commentText, userId);

            console.log('comment in Post.jsx:', newComment);

            if (typeof newComment === 'string') {
                setCommentErrorMessage(newComment);
                setCommentSuccessMessage('');
            }

            const fullNewComment = {
                ...newComment,
                username: username || 'Deleted user'
            };

            if (isViewCommentsClicked) {
                setComments((prevComments) => [fullNewComment, ...(prevComments || [])]);
            };

            setCommentErrorMessage('');
            setCommentSuccessMessage('Comment posted successfully.');
            setGeminiResult('');

        } catch (error) {
            console.error('Error onAddSubmitLink:', error);
        } finally {
            setIsAddingComment(false);
            setCommentText('');
        }
    }

    const onViewCommentsClick = () => {
        setIsViewCommentsClicked(preVal => !preVal)
    }

    const onLoadMoreCommentsClick = async () => {
        await getCommentsByPostId();
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
        <Row className='post__comment-section-row mx-auto'>

            {/* Leave a comment */}
            <Col xs={12} lg={5}>
                <div className='sticky-top'>
                    <h3>
                        Leave a comment
                    </h3>

                    <Form
                        onSubmit={onCreateCommentSubmit}
                        style={{ maxWidth: (!isXs && !isSm && !isMd) ? '503px' : '100%' }}
                        className='mx-auto'
                    >

                        <Form.Group className='mb-3' controlId='userCommentEntryField'>
                            <span className='d-flex justify-content-between align-items-center mb-2'>
                                <Form.Label className='mb-0'>
                                    Comment
                                </Form.Label>

                                <Form.Text id='commentHelpText' className='mt-0'>
                                    {commentText.length}/300 characters
                                </Form.Text>
                            </span>
                            <Form.Control
                                as='textarea'
                                name='userComment'
                                rows={5}
                                aria-describedby='commentHelpText'
                                placeholder='Enter comment'
                                value={commentText}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.length <= 300) {
                                        setCommentText(value);
                                    }
                                }}
                            />
                            <Form.Text id='commentHelpText' className='text-muted'>
                                FitClue utilizes AI to ensure a safe and respectful environment for all users and visitors.
                            </Form.Text>
                        </Form.Group>

                        {
                            geminiResult &&
                            <Row>
                                <Col className='mb-3'>
                                    <Form.Text className='text-danger'>
                                        {geminiResult}
                                    </Form.Text>
                                </Col>
                            </Row>
                        }

                        <TextTooltip
                            tooltipText={!isLoggedIn ? 'Please sign in to leave a comment.' : 'Post Comment'}
                        >
                            <Button
                                type='submit'
                                disabled={!isLoggedIn || !commentText}
                                className='mb-3'
                            >
                                {
                                    !isAddningComment ?
                                        'Post Comment' :
                                        <LoadingComponent loadingText={
                                            !isRunningGemini ?
                                                'Posting Comment' :
                                                'Scanning comment with AI'}
                                        />
                                }
                            </Button>
                        </TextTooltip>

                        <Row>
                            <Col className='mb-3'>
                                <Form.Text className={commentSuccessMessage ? 'text-success' : 'text-danger'}>
                                    {commentSuccessMessage || commentErrorMessage}
                                </Form.Text>
                            </Col>
                        </Row>

                    </Form>
                </div>
            </Col>

            {/* Comments */}
            <Col>
                <Row className='d-flex flex-column justify-content-center mx-auto'>
                    <Col className='sticky-top px-0'>
                        <Button
                            onClick={onViewCommentsClick}
                            className='sticky-top mb-3 w-100'
                        >
                            {isViewCommentsClicked ? 'Hide' : 'View'} Comments
                        </Button>
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
                                        <p>No comments yet</p>
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


                </Row>
            </Col>

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
