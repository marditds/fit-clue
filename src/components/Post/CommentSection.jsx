import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { LoadingComponent } from '../Loading/LoadingComponent';
import { dateTimeFormatter } from '../../lib/utils/dateTimeFormatter';
import { usePosts } from '../../lib/hooks/usePosts';
import { onePostComments } from '../../lib/data/testData';
import { ReportModal } from '../Modals/Modals';
import { commentReportCategories } from '../../lib/data/reportCategories';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';

export const CommentSection = ({ postId, username, userId }) => {

    const { comments, setComments, createComment, fetchComments, createReportComment } = usePosts();

    const { isXs, isSm, isMd, isLg, isXl, isXxl } = useBreakpoints();

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

                // await fetchComments(postId);

                setComments(onePostComments);

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
        <Row style={{ marginTop: '24px' }}>
            <Col xs={12} lg={6}>
                <div className='sticky-top'>
                    <h3>
                        Leave a comment
                    </h3>

                    <Form onSubmit={onCreateCommentSubmit} >

                        <Form.Group className='mb-3' controlId='userCommentEntryField'>
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                                as='textarea'
                                name='userComment'
                                rows={3}
                                aria-describedby='commentHelpText'
                                placeholder='Enter comment'
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <Form.Text id='commentHelpText' className='text-muted'>
                                FitClue utilizes AI to ensure a safe and respectful environment for all users and visitors.
                            </Form.Text>
                        </Form.Group>

                        <Button type='submit'>
                            {!isAddningComment ? 'Submit' : <LoadingComponent />}
                        </Button>
                    </Form>
                </div>
            </Col>
            <Col>
                <Row className='d-flex flex-column justify-content-center mx-auto'>

                    <Button
                        onClick={onViewCommentsClick}
                        className='sticky-top'
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
                                                <Row className='my-4 justify-content-center'>
                                                    <Col xs={2} className=''>
                                                        <strong>
                                                            {comment.username}
                                                        </strong>
                                                        <br />
                                                        <sub>{dateTimeFormatter(comment.$createdAt)}</sub>
                                                    </Col>
                                                    <Col xs={8} className='text-wrap text-break'>
                                                        {comment.comment_text}
                                                    </Col>
                                                    <Col xs={1} className='p-0 d-flex justify-content-center align-items-center'>
                                                        {(isXs || isSm || isMd) ?
                                                            <Button className=' bg-transparent p-0'>
                                                                <i className='bi bi-three-dots-vertical' />
                                                            </Button>
                                                            :
                                                            <Button onClick={() => handleReportClick(comment)} className=''>
                                                                <i className='bi bi-flag' />
                                                            </Button>
                                                        }
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
