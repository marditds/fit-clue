import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext, Link } from 'react-router-dom';
import { useUser } from '../../lib/hooks/useUser';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import '../../components/Form/Form.css';

export const SignIn = () => {

    const navigate = useNavigate();

    const {
        userId, setUserId,
        sessionId, setSessionId,
        setIsLoggedIn, setIsSessionInProgress
    } = useOutletContext();

    const { signInUser } = useUser();

    const { isXs, isSm, isMd, isLg, isXl, isXxl } = useBreakpoints();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [christmasWish, setChristmasWish] = useState('');
    const [isSigningInInProgress, setIsSigningInInProgress] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const onSignInUserClick = async () => {

        if (christmasWish) {
            setErrorMsg('Something went wrong.');
            return;
        };

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
        <Container className='min-vh-100 d-flex justify-content-center align-items-center'>
            <Row className='form__row w-100'>
                <Col xs={5} className={`form__col-signin-img ${(isXs || isSm) && 'd-none'}`}>
                </Col>
                <Col className='form__col d-flex justify-content-center align-items-center w-100'>
                    <Form className={(isXs) ? 'w-100' : 'w-75'}>

                        <div className='text-center mb-4'>
                            <h3 className='mb-2'>Welcome</h3>
                            <p className='text-muted'>Sign in to your account</p>
                        </div>

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

                            <div className='text-end mt-1'>
                                <Link to='/forgot-password' className='text-decoration-none small'>
                                    Forgot password?
                                </Link>
                            </div>
                        </Form.Group>

                        <Form.Group style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
                            <Form.Control
                                type='text'
                                id='christmasWish'
                                name='christmasWish'
                                value={christmasWish}
                                onChange={(e) => setChristmasWish(e.target.value)}
                                autoComplete='off'
                                tabIndex='-1'
                                aria-hidden='true'
                            />
                        </Form.Group>

                        <Button
                            type='button'
                            onClick={onSignInUserClick}
                            disabled={isSigningInInProgress || !!christmasWish || !email || password.length < 8}
                            className='w-100 mb-3'
                        >
                            {!isSigningInInProgress ? 'Sign in' : 'Loading...'}
                        </Button>

                        {errorMsg &&
                            <Form.Text className='text-danger d-block mb-3'>
                                {errorMsg}
                            </Form.Text>
                        }

                        <div className='text-center'>
                            <span className='text-muted'>Don't have an account? </span>
                            <Link to='/sign-up' className='text-decoration-none fw-medium'>
                                Sign up
                            </Link>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}