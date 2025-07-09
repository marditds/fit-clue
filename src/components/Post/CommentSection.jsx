import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Row } from 'react-bootstrap';
import { AddComment } from '../Form/AddComment';
import { PostedComments } from './PostedComments';

export const CommentSection = ({ postId, username, userId, isLoggedIn }) => {

    const [isViewCommentsClicked, setIsViewCommentsClicked] = useState(false);

    return (
        <Row className='post__comment-section-row mx-auto'>

            {/* Leave a comment */}
            <Col xs={12} lg={5}>
                <div className='sticky-top'>
                    <h3>
                        Leave a comment
                    </h3>

                    {
                        isLoggedIn ?
                            <AddComment
                                postId={postId}
                                userId={userId}
                                username={username}
                                isLoggedIn={isLoggedIn}
                                isViewCommentsClicked={isViewCommentsClicked}
                            />
                            :
                            <div className='mb-3'>
                                <p>
                                    Please <Link to='/sign-in'>sign in</Link> to leave a comment. If you don't have an account, <Link to='/sign-up'>sign up</Link>.
                                </p>
                                <Row className='d-flex justify-content-evenly'>
                                    <Col>
                                        <Button
                                            as={Link}
                                            to='/sign-in'
                                            className='w-100'
                                        >
                                            Sign In
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button
                                            as={Link}
                                            to='/sign-up'
                                            className='w-100'
                                        >
                                            Sign Up
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                    }

                </div>
            </Col>

            {/* Comments */}
            <Col>
                <PostedComments
                    postId={postId}
                    isLoggedIn={isLoggedIn}
                    isViewCommentsClicked={isViewCommentsClicked}
                    setIsViewCommentsClicked={setIsViewCommentsClicked}
                />
            </Col>

        </Row>
    )
}
