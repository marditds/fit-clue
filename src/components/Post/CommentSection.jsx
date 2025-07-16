import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { AddComment } from '../Form/AddComment';
import { PostedComments } from './PostedComments';
import { authText } from '../../config/formText';
import { LockComponent } from './LockComponent';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';

export const CommentSection = ({ postId, username, userId, isLoggedIn }) => {

    const { isXs, isSm, isMd } = useBreakpoints();

    const [comments, setComments] = useState([]);
    const [commentsTotal, setCommentsTotal] = useState(0);
    const [isViewCommentsClicked, setIsViewCommentsClicked] = useState(false);

    return (
        <Row className='post__comment-section-row mx-auto'>

            {/* Leave a comment */}
            <Col xs={12} lg={5}>
                <div className='sticky-top'>
                    <h3>
                        <i className='bi bi-chat-left-dots me-2' />   Leave a comment
                    </h3>

                    {
                        isLoggedIn ?
                            // Add comment
                            <AddComment
                                postId={postId}
                                userId={userId}
                                username={username}
                                isLoggedIn={isLoggedIn}
                                isViewCommentsClicked={isViewCommentsClicked}
                                setComments={setComments}
                                setCommentsTotal={setCommentsTotal}
                            />
                            :
                            // Lock
                            <LockComponent
                                rowClassName='d-flex justify-content-evenly'
                                lockText={<>
                                    Please sign in to leave a comment. Don't have an account?{' '}
                                    <Link to="/sign-up">
                                        Create one for free
                                    </Link>.
                                </>}
                                divClassName='mb-3'
                                path='/sign-in'
                                titleClassName='mb-0'
                                btnClassName={isXs || isSm || isMd ? 'w-100' : 'w-auto'}
                                btnText={authText.signIn.button}
                            />
                    }

                </div>
            </Col>

            {/* Comments */}
            <Col>
                <PostedComments
                    postId={postId}
                    isLoggedIn={isLoggedIn}
                    isViewCommentsClicked={isViewCommentsClicked}
                    comments={comments}
                    commentsTotal={commentsTotal}
                    setComments={setComments}
                    setCommentsTotal={setCommentsTotal}
                    setIsViewCommentsClicked={setIsViewCommentsClicked}
                />
            </Col>

        </Row>
    )
}
