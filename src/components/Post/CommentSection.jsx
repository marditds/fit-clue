import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { LoadingComponent } from '../Loading/LoadingComponent';
import { dateTimeFormatter } from '../../lib/utils/dateTimeFormatter';
import { usePosts } from '../../lib/hooks/usePosts';
import { onePostComments } from '../../lib/data/testData';


export const CommentSection = ({ postId, username, userId }) => {

    const { comments, setComments, createComment, fetchComments } = usePosts();

    const [commentText, setCommentText] = useState('');
    const [isAddningComment, setIsAddingComment] = useState(false);
    const [isViewCommentsClicked, setIsViewCommentsClicked] = useState(false);
    const [isCommentsLoading, setICommentsLoading] = useState(false);

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
        setIsViewCommentsClicked(true)
    }

    return (
        <Row>
            <Col>
                <h3>Comment section</h3>

                <Form onSubmit={onCreateCommentSubmit}>

                    <Form.Group className='mb-3' controlId='userCommentEntryField'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter comment'
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <Form.Text className='text-muted'>
                            FitClue utilizes AI to ensure a safe and respectful environment for all users and visitos.
                        </Form.Text>
                    </Form.Group>

                    <Button type='submit'>
                        {!isAddningComment ? 'Submit' : <LoadingComponent />}
                    </Button>
                </Form>
            </Col>
            <Col>
                <Row className='d-flex flex-column justify-content-center mx-auto'
                    style={{ maxWidth: '538px' }}
                >
                    <Button onClick={onViewCommentsClick}>
                        View Comments
                    </Button>

                    {isViewCommentsClicked ? (
                        !isCommentsLoading ? (
                            <Col>
                                {
                                    comments?.length > 0
                                        ? comments.map((comment, idx) => (
                                            <div key={idx}>
                                                <Row className='my-4'>
                                                    <Col xs={2} className=''>
                                                        <strong>
                                                            {comment.username}
                                                        </strong>
                                                        <br />
                                                        <sub>{dateTimeFormatter(comment.$createdAt)}</sub>
                                                    </Col>
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
        </Row>
    )
}
