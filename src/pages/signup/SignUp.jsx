import { useState } from 'react';
import { useUser } from '../../lib/hooks/useUser';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import { useNavigate, useOutletContext } from 'react-router-dom';

export const SignUp = () => {

    const navigate = useNavigate();

    const { createUser } = useUser();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [easterWish, setEasterWish] = useState('');
    const [isAccoutBeingCreated, setIsAccountBeingCreated] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const onCreateUserClick = async () => {

        if (easterWish) {
            setErrorMsg('Something went wrong.');
            return;
        };

        if (password !== confirmPassword) {
            setErrorMsg('Your password\s do not match. Please try again.')
            return;
        }

        setIsAccountBeingCreated(true);
        try {
            const user = await createUser(email, password, name);

            if (typeof user === 'string') {
                setErrorMsg(user);
                return;
            }

            navigate('/sign-in');

        } catch (error) {
            console.error('Error creating user:', error);
        } finally {
            setIsAccountBeingCreated(false);
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

                        <Form.Group className='mb-3' controlId='confirmPasswordFormField'>
                            <Form.Label>Re-enter password</Form.Label>
                            <Form.Control
                                type='password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder='Password'
                            />
                        </Form.Group>

                        <Form.Group style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
                            <Form.Control
                                type='text'
                                id='easterWish'
                                name='easterWish'
                                value={easterWish}
                                onChange={(e) => setEasterWish(e.target.value)}
                                autoComplete='off'
                                tabIndex='-1'
                                aria-hidden='true'
                            />
                        </Form.Group>

                        <Button
                            type='button'
                            onClick={onCreateUserClick}
                            disabled={isAccoutBeingCreated || !!easterWish}
                        >
                            {!isAccoutBeingCreated ? 'Sign up' : 'Loading...'}
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
