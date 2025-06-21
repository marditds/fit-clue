import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useUser } from '../../lib/hooks/useUser';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

export const SignIn = () => {

    const navigate = useNavigate();

    const { userId, sessionId, setSessionId, setUserId, setIsLoggedIn, setIsSessionInProgress } = useOutletContext();

    const { signInUser } = useUser();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningInInProgress, setIsSigningInInProgress] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const onSignInUserClick = async () => {

        setIsSigningInInProgress(true);
        try {
            const user = await signInUser(email, password);

            if (typeof user === 'string') {
                setErrorMsg(user);
                return;
            }

            if (typeof user === null) {
                setErrorMsg('Something went wrong. Please try again later.');
                return;
            }

            console.log('user in SignIn.jsx:', user);

            localStorage.setItem('authUserId', user.userId);

            setSessionId(user.$id);
            setUserId(user.userId);
            setIsLoggedIn(true);
            setIsSessionInProgress(true);

            navigate('/');

        } catch (error) {
            console.error('Error signing in user:', error);
        } finally {
            setIsSigningInInProgress(false);
        }
    }

    useEffect(() => {
        console.log('userId:', userId);
    }, [userId])

    useEffect(() => {
        console.log('sessionId:', sessionId);
    }, [sessionId])

    return (
        <Container>
            <Row>
                <Col>
                    <Form>

                        <Form.Group className='mb-3' controlId='emailFormField'>
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='Enter email'
                            />
                        </Form.Group>

                        <Form.Group className='mb-3' controlId='passwordFormField'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Password'
                            />
                        </Form.Group>

                        <Button
                            variant='primary'
                            type='button'
                            onClick={onSignInUserClick}
                            disabled={isSigningInInProgress}
                        >
                            {!isSigningInInProgress ? 'Sign in' : 'Loading...'}
                        </Button>

                        {errorMsg &&
                            <Form.Text>
                                {errorMsg}
                            </Form.Text>
                        }
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}