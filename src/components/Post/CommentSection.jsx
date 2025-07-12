import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Row } from 'react-bootstrap';
import { AddComment } from '../Form/AddComment';
import { PostedComments } from './PostedComments';
import { authText } from '../../config/formText';
import { LockComponent } from './LockComponent';

export const CommentSection = ({ postId, username, userId, isLoggedIn }) => {

    const [comments, setComments] = useState([]);
    const [commentsTotal, setCommentsTotal] = useState(0);
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
                                setComments={setComments}
                                setCommentsTotal={setCommentsTotal}
                            />
                            :
                            <LockComponent
                                rowClassName='d-flex justify-content-evenly'
                                lockText={`Please sign in to leave a comment. Don't have an account? ${<Link to='/sign-up'>Create one for free</Link>}.`}
                                divClassName='mb-3'
                                path='/sign-in'
                                btnClassName=''
                                btnText={authText.signIn.button}
                            />
                        // <div className='mb-3'>
                        //     <p>
                        //         {authText.commentPrompt}
                        //     </p>
                        //     <Row className='d-flex justify-content-evenly'>
                        //         <Col>
                        //             <Button
                        //                 as={Link}
                        //                 to='/sign-in'
                        //                 className='w-100'
                        //             >
                        //                 {authText.signIn.button}
                        //             </Button>
                        //         </Col>
                        //         <Col>
                        //             <Button
                        //                 as={Link}
                        //                 to='/sign-up'
                        //                 className='w-100'
                        //             >
                        //                 {authText.signUp.button}
                        //             </Button>
                        //         </Col>
                        //     </Row>
                        // </div>
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
