import { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useUser } from '../../lib/hooks/useUser';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import '../../components/Form/Form.css';
import { Link } from 'react-router-dom';

export const ForgotPassword = () => {

    const { createPasswordRecoveryEmail } = useUser();

    const { isXs, isSm, isMd, isLg, isXl, isXxl } = useBreakpoints();


    const [email, setEmail] = useState('');
    const [thanksgivingWish, setThanksgivingWish] = useState('');
    const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
    const [forgotPsswdSuccessMsg, setForgotPsswdSuccessMsg] = useState(null);
    const [forgotPsswdErrorMsg, setForgotPsswdErrorMsg] = useState(null);

    const onForgotPasswordClick = async (event) => {

        event.preventDefault();

        if (thanksgivingWish) {
            setErrorMsg('Try again.');
            return;
        }

        try {
            setIsForgotPasswordLoading(true);

            console.log('onForgotPassword clicked.');

            const res = await createPasswordRecoveryEmail(email);

            if (typeof res === 'string') {
                setForgotPsswdErrorMsg(res);
                setForgotPsswdSuccessMsg(null);
                setEmail('');
                return;
            } else if (res === 404) {
                setForgotPsswdErrorMsg('No account is associated with this email address. Please check the email or sign up for a new account.');
                setForgotPsswdSuccessMsg(null);
                return;
            }

            setEmail('');
            setForgotPsswdSuccessMsg('A recovery link from Appwrite has been sent to your email. Please check your inbox.');
            setForgotPsswdErrorMsg('');
        } catch (error) {
            console.error('Error onForgotPassword:', error);
            setForgotPsswdErrorMsg('Something went wrong. Please try again later.');
        } finally {
            setIsForgotPasswordLoading(false);
        }
    }

    return (
        <Container className='min-vh-100 d-flex justify-content-center align-items-center'>
            <Row className='form__row w-100'>
                <Col xs={5} className={`form__col-forgot-img ${(isXs || isSm) && 'd-none'}`}></Col>
                <Col className='form__col d-flex justify-content-center align-items-center w-100'>
                    <Form className={(isXs) ? 'w-100' : 'w-75'}>
                        {/* Form header for better context */}
                        <div className='text-center mb-4'>
                            <h3 className='mb-2'>Reset Your Password</h3>
                            <p className='text-muted'>Enter your email address and we'll send you a link to reset your password.</p>
                        </div>

                        <Form.Group className='mb-3' controlId='emailField'>
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder='Enter your email address'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
                            <Form.Control
                                type='text'
                                id='thanksgivingWish'
                                name='thanksgivingWish'
                                value={thanksgivingWish}
                                onChange={(e) => setThanksgivingWish(e.target.value)}
                                autoComplete='off'
                                tabIndex='-1'
                                aria-hidden='true'
                            />
                        </Form.Group>

                        <Button
                            onClick={onForgotPasswordClick}
                            disabled={isForgotPasswordLoading || !!thanksgivingWish || !email}
                            className='w-100 mb-3'
                        >
                            {!isForgotPasswordLoading ? 'Send Reset Link' : 'Sending...'}
                        </Button>

                        {forgotPsswdSuccessMsg && (
                            <div className='text-center mb-3'>
                                {forgotPsswdSuccessMsg}
                            </div>
                        )}

                        {forgotPsswdErrorMsg && (
                            <div className='text-center mb-3'>
                                {forgotPsswdErrorMsg}
                            </div>
                        )}

                        <div className='text-center'>
                            <div className='mb-2'>
                                <span className='text-muted'>Remember your password? </span>
                                <Link to='/sign-in' className='text-decoration-none fw-medium'>
                                    Sign in
                                </Link>
                            </div>
                            <div>
                                <span className='text-muted'>Don't have an account? </span>
                                <Link to='/sign-up' className='text-decoration-none fw-medium'>
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
