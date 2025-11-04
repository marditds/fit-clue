import { useState } from 'react';
import { useGemini } from '../../lib/hooks/useGemini';
import { usePosts } from '../../lib/hooks/usePosts';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { LoadingComponent } from '../Loading/Loading';

export const AddComment = ({ postId, userId, username, isLoggedIn, isViewCommentsClicked, setComments, setCommentsTotal }) => {

    const { isXs, isSm, isMd } = useBreakpoints();

    const { isRunningGemini, runGemini } = useGemini();

    const { createComment } = usePosts();

    // Leaving a comment
    const [commentText, setCommentText] = useState('');
    const [commentSuccessMessage, setCommentSuccessMessage] = useState('');
    const [commentErrorMessage, setCommentErrorMessage] = useState('');
    const [isAddningComment, setIsAddingComment] = useState(false);

    // Gemini Results
    const [geminiResult, setGeminiResult] = useState('');

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

            if (isViewCommentsClicked === true) {
                setComments((prevComments) => [fullNewComment, ...(prevComments || [])]);
                setCommentsTotal((prevTotal) => prevTotal + 1);
            };

            setCommentErrorMessage('');
            setCommentSuccessMessage('Comment posted successfully.');
            setGeminiResult('');

        } catch (error) {
            console.error('Error onCreateCommentSubmit:', error);
        } finally {
            setIsAddingComment(false);
            setCommentText('');
        }
    }

    return (
        <Form
            onSubmit={onCreateCommentSubmit}
            style={{ maxWidth: (!isXs && !isSm && !isMd) ? '503px' : '100%' }}
            className='mx-auto'>

            <Form.Group className={!geminiResult ? 'mb-3' : 'mb-2'} controlId='userCommentEntryField'>
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
                <ul className='ps-3 mt-2 mb-0 text-muted'>
                    <li>
                        Please keep your discussions respectful.
                    </li>
                    <li>
                        Posting links in the comments section is not allowed.
                    </li>
                </ul>
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

            <Button
                type='submit'
                disabled={!isLoggedIn || !commentText || isAddningComment}
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