import { useState } from 'react';
import { usePosts } from '../../lib/hooks/usePosts';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { LoadingComponent } from '../Loading/Loading';
import { devError } from '../../lib/utils/devConsole';

export const AddComment = ({ postId, userId, username, isLoggedIn, isViewCommentsClicked, setComments, setCommentsTotal }) => {

    const { isXs, isSm, isMd } = useBreakpoints();

    const { createComment } = usePosts();

    // Leaving a comment
    const [commentText, setCommentText] = useState('');
    const [commentSuccessMessage, setCommentSuccessMessage] = useState('');
    const [commentErrorMessage, setCommentErrorMessage] = useState('');
    const [isAddningComment, setIsAddingComment] = useState(false);

    const onCreateCommentSubmit = async (e) => {

        e.preventDefault();

        try {
            setIsAddingComment(true);

            const newComment = await createComment(postId, commentText, userId);

            if (newComment.message !== 'ok') {
                setCommentErrorMessage(newComment.message);
                setCommentSuccessMessage('');
                return;
            }

            const fullNewComment = {
                ...newComment,
                username: username || 'Deleted user'
            };

            if (isViewCommentsClicked === true) {
                setComments((prevComments) => [fullNewComment, ...(prevComments || [])]);
                setCommentsTotal((prevTotal) => prevTotal + 1);
            };

            setCommentErrorMessage('');
            setCommentSuccessMessage('Comment posted successfully.');
            setCommentText('');

        } catch (error) {
            devError('Error onCreateCommentSubmit:', error);
        } finally {
            setIsAddingComment(false);
        }
    }

    return (
        <Form
            onSubmit={onCreateCommentSubmit}
            style={{ maxWidth: (!isXs && !isSm && !isMd) ? '503px' : '100%' }}
            className='mx-auto'>

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
                    disabled={isAddningComment}
                />
                <Form.Text id='commentHelpText' className='text-muted'>
                    FitClue utilizes AI to ensure a safe and respectful environment for all users and visitors.
                </Form.Text>
                <ul className='ps-3 mt-2 mb-0 text-muted'>
                    <li>
                        Please keep your discussions respectful.
                    </li>
                    <li>
                        Posting links in the comments section is not allowed.
                    </li>
                </ul>
            </Form.Group>

            <Button
                type='submit'
                disabled={!isLoggedIn || !commentText || isAddningComment}
                className='mb-3'
            >
                {
                    !isAddningComment ?
                        'Post Comment' :
                        <LoadingComponent loadingText={'Scanning comment'}
                        />
                }
            </Button>

            <Row>
                <Col className='mb-3'>
                    <Form.Text className={commentSuccessMessage ? 'text-success' : 'text-danger'}>
                        {commentSuccessMessage || commentErrorMessage}
                    </Form.Text>
                </Col>
            </Row>

        </Form>
    )
}