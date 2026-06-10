import { useEffect, useState } from 'react';
import { useUser } from '../../lib/hooks/useUser';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import signUpImg from '../../assets/sign-up.jpg'
import { SignForm } from '../../components/Form/SignForm';
import { keysProvider } from '../../lib/context/keysProvider';
import { reCaptchaVerification } from '../../lib/context/dbhandler';
import { authText } from '../../config/formText';
import { useDocumentTitle } from '../../lib/hooks/useDocumentTitle';

const SignUp = () => {

    useDocumentTitle(`Sign up | FitClue`);

    const { setUserId, setIsLoggedIn, setIsSessionInProgress } = useOutletContext();

    const navigate = useNavigate();

    const { createUser } = useUser();

    const { isXs, isSm, isMd } = useBreakpoints();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [easterWish, setEasterWish] = useState('');
    const [isAccountBeingCreated, setIsAccountBeingCreated] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    // Agreement checkbox
    const [isCheckboxClicked, setIsCheckBoxClicked] = useState(false);

    // ReCaptcha
    const [reCaptchaSiteKey, setReCaptchaSiteKey] = useState('');
    const [isReCaptchaVerficationLoading, setIsReCaptchaVerficationLoading] = useState(false);
    const [isReCaptchaVerified, setIsReCaptchaVerified] = useState(false);
    const [reCaptchaSuccessMessage, setReCaptchaSuccessMessage] = useState('');
    const [reCaptchaErrorMessage, setReCaptchaErrorMessage] = useState('');


    const onAgreementCheckboxChange = () => {
        setIsCheckBoxClicked(preVal => !preVal)
    }

    const onCreateUserClick = async (e) => {

        if (easterWish) {
            setErrorMsg('Something went wrong.');
            return;
        };

        if (password !== confirmPassword) {
            setErrorMsg('Your password\s do not match. Please try again.')
            return;
        }

        e.preventDefault();

        setIsAccountBeingCreated(true);
        try {
            const user = await createUser(email, password, username);

            if (typeof user === 'string') {
                setErrorMsg(user);
                return;
            }

            setUserId(user.$id);
            setIsLoggedIn(true);
            setIsSessionInProgress(true);

            navigate('/');

        } catch (error) {
            console.error('Error creating user:', error);
        } finally {
            setIsAccountBeingCreated(false);
        }
    }

    useEffect(() => {
        keysProvider('recaptcha', setReCaptchaSiteKey)
    }, []);

    const onReCaptchaChange = async (value) => {

        setIsReCaptchaVerficationLoading(true);

        if (value) {
            const result = await reCaptchaVerification(value);

            if (result?.success) {
                setIsReCaptchaVerified(true);
                setIsReCaptchaVerficationLoading(false);
                setReCaptchaSuccessMessage('reCAPTCHA verification was sucessful.')
                setReCaptchaErrorMessage('')
            } else {
                setIsReCaptchaVerified(false);
                setReCaptchaErrorMessage('reCAPTCHA verification failed. Please try again.');
                setReCaptchaSuccessMessage('');
                setIsReCaptchaVerficationLoading(false);
            }
        } else {
            setIsReCaptchaVerified(false);
            setIsReCaptchaVerficationLoading(false);
            setReCaptchaSuccessMessage('');
            setReCaptchaErrorMessage('reCAPTCHA verification has either expired or failed. Please try again.');
        }
    };

    const fields = [
        {
            id: 'usernameField',
            label: 'Username',
            type: 'text',
            value: username,
            onChange: (e) => setUsername(e.target.value),
            placeholder: 'Enter your Username'
        },
        {
            id: 'emailField',
            label: 'Email address',
            type: 'email',
            value: email,
            onChange: (e) => setEmail(e.target.value),
            placeholder: 'Enter your email'
        },
        {
            id: 'passwordField',
            label: 'Password',
            type: 'password',
            value: password,
            onChange: (e) => setPassword(e.target.value),
            placeholder: 'Create a password'
        },
        {
            id: 'confirmPasswordField',
            label: 'Confirm password',
            type: 'password',
            value: confirmPassword,
            onChange: (e) => setConfirmPassword(e.target.value),
            placeholder: 'Re-enter your password'
        }
    ];

    return (
        <SignForm
            title={authText.signUp.heading}
            subtitle={authText.signUp.subheading}
            fields={fields}
            onSubmit={onCreateUserClick}
            submitText={authText.signUp.button}
            disabled={isAccountBeingCreated || !!easterWish || !username || !email || !password || !confirmPassword || !isReCaptchaVerified || isCheckboxClicked === false}
            loading={isAccountBeingCreated}
            loadingText={'Creating your account'}
            agreementText={
                <>
                    I have read and agree to the{' '}
                    <Link to='/tos' target='_blank'>
                        Terms of Service
                    </Link>,{' '}
                    <Link to='/privacy' target='_blank'>
                        Privacy Policy
                    </Link>,
                    {' '} and {' '}
                    <Link to='/community-guidelines' target='_blank'>
                        Community Guidelines
                    </Link>
                    .
                </>
            }
            onAgreementCheckboxChange={onAgreementCheckboxChange}
            error={errorMsg}
            hiddenField={{
                id: 'easterWish',
                name: 'easterWish',
                value: easterWish,
                onChange: (e) => setEasterWish(e.target.value)
            }}
            backgroundImage={signUpImg}
            colImgClass="form__col-signup-img"
            isXs={isXs}
            isSm={isSm}
            isMd={isMd}
            onReCaptchaChange={onReCaptchaChange}
            reCaptchaSiteKey={reCaptchaSiteKey}
            showReCaptcha={true}
            isReCaptchaVerficationLoading={isReCaptchaVerficationLoading}
            reCaptchaErrorMessage={reCaptchaErrorMessage}
            reCaptchaSuccessMessage={reCaptchaSuccessMessage}
            links={[
                {
                    text: `${authText.signUp.haveAccountPrompt}`,
                    linkText: `${authText.signUp.signInLinkText}`,
                    href: '/sign-in'
                }
            ]}
        />
    )
}

export default SignUp;