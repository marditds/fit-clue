import { useState } from 'react';
import { useUser } from '../../lib/hooks/useUser';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import '../../components/Form/Form.css'
import { LoadingComponent } from '../../components/Loading/LoadingComponent';

export const SignUp = () => {

    const navigate = useNavigate();

    const { createUser } = useUser();

    const { isXs, isSm, isMd, isLg, isXl, isXxl } = useBreakpoints();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [easterWish, setEasterWish] = useState('');
    const [isAccountBeingCreated, setIsAccountBeingCreated] = useState(false);
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
            const user = await createUser(email, password, username);

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
        <Container className='min-vh-100 d-flex justify-content-center align-items-center'>
            <Row className='form__row w-100'>
                <Col xs={5} className={`form__col-signup-img ${(isXs || isSm) && 'd-none'}`}>
                </Col>
                <Col className='form__col d-flex justify-content-center align-items-center w-100'>
                    <Form className={(isXs) ? 'w-100' : 'w-75'}>

                        <div className='text-center mb-4'>
                            <h3 className='mb-2'>Create Your Account</h3>
                            <p className='text-muted'>Join us today and get started</p>
                        </div>

                        <Form.Group className='mb-3' controlId='usersnameFormField'>
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type='text'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder='Enter your Username'
                            />
                        </Form.Group>

                        <Form.Group className='mb-3' controlId='emailFormField'>
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='Enter your email'
                            />
                        </Form.Group>

                        <Form.Group className='mb-3' controlId='passwordFormField'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Create a password'
                            />
                        </Form.Group>

                        <Form.Group className='mb-3' controlId='confirmPasswordFormField'>
                            <Form.Label>Confirm password</Form.Label>
                            <Form.Control
                                type='password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder='Re-enter your password'
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
                            disabled={isAccountBeingCreated || !!easterWish || !username || !email || !password || !confirmPassword}
                            className='w-100 mb-3 position-relative'
                        >
                            {isAccountBeingCreated ?
                                'Create Account' :
                                <LoadingComponent />
                            }
                        </Button>

                        {errorMsg &&
                            <Form.Text className='text-danger d-block mb-3'>
                                {errorMsg}
                            </Form.Text>
                        }

                        <div className='text-center'>
                            <span className='text-muted'>Already have an account? </span>
                            <Link to='/sign-in' className='text-decoration-none fw-medium'>
                                Sign in
                            </Link>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
