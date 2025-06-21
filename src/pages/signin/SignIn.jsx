import { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useUser } from '../../lib/hooks/useUser';

export const SignIn = () => {

    const { signInUser } = useUser();

    const [name, setName] = useState('');
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
        } catch (error) {
            console.error('Error signing in user:', error);
        } finally {
            setIsSigningInInProgress(false);
        }

    }

    return (
        <Container>
            <Row>
                <Col>
                    <Form>
                        <Form.Group className='mb-3' controlId='nameFormField'>
                            <Form.Label>Full name:</Form.Label>
                            <Form.Control
                                type='name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder='Enter name'
                            />
                        </Form.Group>

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