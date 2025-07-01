import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../lib/hooks/useUser';
import { Form } from 'react-bootstrap';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import { PasswordForm } from '../../components/Form/PasswordForm';
import resetImg from '../../assets/reset-password.jpg';

export const ResetPassword = () => {

    const { updatePasswordFromRecoveryEmail } = useUser();

    const { isXs, isSm } = useBreakpoints();

    const [userId, setUserId] = useState(null);
    const [secret, setSecret] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [hasRecoveryLinkExpired, setHasRecoveryLinkExpired] = useState(false);
    const [isResetPasswordLoading, setIsResetPasswordLoading] = useState(false);
    const [resetPsswdSuccessMsg, setResetPsswdSuccessMsg] = useState(null);
    const [resetPsswdErrorMsg, setResetPsswdErrorMsg] = useState(null);

    // Get Reset Details
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setUserId(params.get('userId'));
        setSecret(params.get('secret'));

        console.log('THESE ARE THE PARAMS:', params);

        // if (params.size === 0) {
        //     navigate('/');
        // }

        const functionInResetPasswrodComponent = async () => {
            try {
                console.log('Starting FunctionInResetPasswrodComponent in <ResetPassword/>.');

                console.log('FunctionInResetPasswrodComponent in process.');

            } catch (err) {
                console.error('Authentication failed. Please try again.', err);
            } finally {
                console.log('Finishing FunctionInResetPasswrodComponent in <ResetPassword/>.');
            }
        };

        if (userId && secret) {
            functionInResetPasswrodComponent();
        }

    }, [userId, secret]);

    // Change password function
    const onPasswrodChangeClick = async (event) => {

        event.preventDefault();

        if (newPassword !== confirmNewPassword) {
            setResetPsswdErrorMsg('Passwords do not match.');
            return;
        }

        try {
            setIsResetPasswordLoading(true);

            console.log('Password change clicked.');

            const res = await updatePasswordFromRecoveryEmail(userId, secret, newPassword);

            if (typeof res === 'string') {
                setResetPsswdErrorMsg(res);
                setResetPsswdSuccessMsg(null);
                return;
            } else if (res === 400) {
                setResetPsswdErrorMsg('Your password must be between 8 and 265 characters.');
                setResetPsswdSuccessMsg(null);
                return;
            } else if (res === 401) {
                setResetPsswdErrorMsg('This link has expired. Request a new recovery email.');
                setResetPsswdSuccessMsg(null);
                setHasRecoveryLinkExpired(true);
                return;
            }

            setResetPsswdSuccessMsg('Your password was changed successfully.')
            setResetPsswdErrorMsg('');

            setNewPassword('');
            setConfirmNewPassword('');

        } catch (error) {
            console.error('Error resetting passowrd:', error);
            setResetPsswdErrorMsg('Something went wrong. Please try again later.');
        } finally {
            setIsResetPasswordLoading(false);
        }
    }

    return (
        <PasswordForm
            isXs={isXs}
            isSm={isSm}
            imgSrc={resetImg}
            leftColClassName='form__col-reset-img'
            headerTitle='Reset Your Password'
            headerSubtitle='Enter your new password below'
            onSubmit={onPasswrodChangeClick}
            isLoading={isResetPasswordLoading}
            buttonText='Update Password'
            buttonDisabled={!newPassword || !confirmNewPassword}
            successMsg={resetPsswdSuccessMsg}
            errorMsg={resetPsswdErrorMsg}
            expiredLinkBlock={
                hasRecoveryLinkExpired && (
                    <>
                        <strong>Link Expired</strong><br />
                        Your recovery link has expired. Please request a new one.
                        <div className='mt-2'>
                            <Link
                                to='/forgot-password'
                                className='btn btn-outline-primary'
                            >
                                Get New Recovery Link
                            </Link>
                        </div>
                    </>
                )
            }
        >
            <Form.Group className='mb-3' controlId='newPasswordField'>
                <Form.Label>New password</Form.Label>
                <Form.Control
                    type='password'
                    placeholder='Enter your new password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
            </Form.Group>

            <Form.Group className='mb-3' controlId='newPasswordRenterField'>
                <Form.Label>Confirm new password</Form.Label>
                <Form.Control
                    type='password'
                    placeholder='Re-enter your new password'
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
            </Form.Group>
        </PasswordForm>
    )
}
