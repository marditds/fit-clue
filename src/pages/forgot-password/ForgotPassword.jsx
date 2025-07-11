import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../lib/hooks/useUser';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import { Form } from 'react-bootstrap';
import { PasswordForm } from '../../components/Form/PasswordForm';
import forgotImg from '../../assets/forgot-password.jpg';

export const ForgotPassword = () => {

    const { createPasswordRecoveryEmail } = useUser();

    const { isXs, isSm } = useBreakpoints();

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
        <PasswordForm
            isXs={isXs}
            isSm={isSm}
            imgSrc={forgotImg}
            leftColClassName='form__col-forgot-img'
            headerTitle='Reset Your Password'
            headerSubtitle="Enter your email address and we'll send you a link to reset your password."
            onSubmit={onForgotPasswordClick}
            isLoading={isForgotPasswordLoading}
            buttonText='Send Reset Link'
            buttonDisabled={!!thanksgivingWish || !email}
            successMsg={forgotPsswdSuccessMsg}
            errorMsg={forgotPsswdErrorMsg}
            extraLinks={
                <>
                    <div className='mb-2'>
                        <span className='text-muted'>Remember your password? </span>
                        <Link to='/sign-in' className='text-decoration-none fw-medium'>
                            Sign in
                        </Link>
                    </div>
                    <div>
                        <span className='text-muted'>New here? </span>
                        <Link to='/sign-up' className='text-decoration-none fw-medium'>
                            Create a free account
                        </Link>
                    </div>
                </>
            }
        >
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
        </PasswordForm>
    )
} 