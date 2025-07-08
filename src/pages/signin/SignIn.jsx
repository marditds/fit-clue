import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext, Link } from 'react-router-dom';
import { useUser } from '../../lib/hooks/useUser';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import { SignForm } from '../../components/Form/SignForm';
import signInImg from '../../assets/sign-in.jpg'

export const SignIn = () => {

    const navigate = useNavigate();

    const {
        userId, setUserId,
        setUsername, setEmail,
        setIsLoggedIn, setIsSessionInProgress
    } = useOutletContext();

    const { signInUser, getUserPreferences, getUserFromCollectionById } = useUser();

    const { isXs, isSm } = useBreakpoints();

    const [emailInSignInForm, setEmailInSignInForm] = useState('');
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
            const user = await signInUser(emailInSignInForm, password);

            if (typeof user === 'string') {
                setErrorMsg(user);
                return;
            }

            if (typeof user === null) {
                setErrorMsg('Something went wrong. Please try again later.');
                return;
            }

            console.log('user in SignIn.jsx:', user);

            const userPerfs = await getUserPreferences();

            const userInColl = await getUserFromCollectionById(userPerfs.profile_id);

            localStorage.setItem('authUserId', userInColl.$id);

            setUserId(userInColl.$id);
            setUsername(userInColl.username);
            setEmail(userInColl.email);
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

    const fields = [
        {
            id: 'emailField',
            label: 'Email',
            type: 'email',
            value: emailInSignInForm,
            onChange: (e) => setEmailInSignInForm(e.target.value),
            placeholder: 'Enter email'
        },
        {
            id: 'passwordField',
            label: 'Password',
            type: 'password',
            value: password,
            onChange: (e) => setPassword(e.target.value),
            placeholder: 'Enter password',
            afterElement: (
                <div className='text-end mt-1'>
                    <Link to='/forgot-password' className='text-decoration-none small'>
                        Forgot password?
                    </Link>
                </div>
            )
        }
    ];

    return (
        <SignForm
            title="Welcome"
            subtitle="Sign in to your account"
            fields={fields}
            onSubmit={onSignInUserClick}
            submitText="Sign In"
            disabled={isSigningInInProgress || !!christmasWish || !emailInSignInForm || password.length < 8}
            loading={isSigningInInProgress}
            loadingText={'Signing in'}
            error={errorMsg}
            hiddenField={{
                id: 'christmasWish',
                name: 'christmasWish',
                value: christmasWish,
                onChange: (e) => setChristmasWish(e.target.value)
            }}
            backgroundImage={signInImg}
            colImgClass="form__col-signin-img"
            isXs={isXs}
            isSm={isSm}
            links={[
                {
                    text: "Don't have an account?",
                    linkText: 'Sign up',
                    href: '/sign-up'
                }
            ]}
        />
    )
}