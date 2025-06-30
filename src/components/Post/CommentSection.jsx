import React, { useEffect, useState } from 'react';
import { Button, Col, Dropdown, DropdownButton, Form, Row } from 'react-bootstrap';
import { LoadingComponent } from '../Loading/LoadingComponent';
import { dateTimeFormatter } from '../../lib/utils/dateTimeFormatter';
import { usePosts } from '../../lib/hooks/usePosts';
import { onePostComments } from '../../lib/data/testData';
import { ReportModal } from '../Modals/Modals';
import { commentReportCategories } from '../../lib/data/reportCategories';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import { CustomTooltip } from '../ToolTip/CustomTooltip';

export const CommentSection = ({ postId, username, userId }) => {

    const { comments, setComments, createComment, fetchComments, createReportComment } = usePosts();

    const { isXs, isSm, isMd, isLg, isXl, isXxl } = useBreakpoints();

    //Fetching comments 
    const [lastComment, setLastComment] = useState(null);
    const [hasMore, setHasMore] = useState(true);


    // Leaving a comment
    const [commentText, setCommentText] = useState('');
    const [isAddningComment, setIsAddingComment] = useState(false);
    const [isViewCommentsClicked, setIsViewCommentsClicked] = useState(false);
    const [isCommentsLoading, setICommentsLoading] = useState(false);

    // Report Comment 
    const [selectedComment, setSelectedComment] = useState(null);
    const [show, setShow] = useState(false);

    // Get the comments for post
    useEffect(() => {
        const getCommentsByPostId = async () => {

            if (!isViewCommentsClicked) {
                return;
            }
            try {
                setICommentsLoading(true);

                const res = await fetchComments(postId, lastComment?.$id || null);

                setComments(prev => [...prev, ...res.documents]);
                setLastComment(res.documents[res.documents.length - 1] || null);
                setHasMore(res.length === 5);

            } catch (error) {

            } finally {
                setICommentsLoading(false);
            }
        }
        getCommentsByPostId();
    }, [isViewCommentsClicked])


    const onCreateCommentSubmit = async (e) => {

        e.preventDefault();

        try {
            setIsAddingComment(true);

            const newComment = await createComment(postId, commentText, userId);

            console.log('comment in Post.jsx:', newComment);

            const fullNewComment = {
                ...newComment,
                username: username || 'Unknown User'
            };

            setComments((prevComments) => [fullNewComment, ...(prevComments || [])]);

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
        <Row className='post__comment-section-row'>
            <Col xs={12} lg={5}>
                <div className='sticky-top'>
                    <h3>
                        Leave a comment
                    </h3>

                    <Form onSubmit={onCreateCommentSubmit} >

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

                        <Button type='submit' className='mb-3'>
                            {!isAddningComment ? 'Submit' : <LoadingComponent />}
                        </Button>
                    </Form>
                </div>
            </Col>
            <Col>
                <Row className='d-flex flex-column justify-content-center mx-auto'>

                    <Button
                        onClick={onViewCommentsClick}
                        className='sticky-top mb-3'
                    >
                        {isViewCommentsClicked ? 'Hide' : 'View'} Comments
                    </Button>

                    {isViewCommentsClicked ? (
                        !isCommentsLoading ? (
                            <Col>
                                {
                                    comments?.length > 0
                                        ? comments.map((comment, idx) => (
                                            <div key={idx}>

                                                <Row className='justify-content-center align-items-center'>
                                                    <Col className='d-flex justify-content-start align-items-baseline'>
                                                        <strong className='me-2'>
                                                            {comment.username}
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
                                        : <li>No comments yet</li>
                                }
                            </Col>
                        ) : (
                            <LoadingComponent />
                        )
                    ) : null}

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
