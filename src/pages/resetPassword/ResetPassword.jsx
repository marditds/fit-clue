import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../lib/hooks/useUser';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import '../../components/Form/Form.css';

export const ResetPassword = () => {

    const navigate = useNavigate();

    const { updatePasswordFromRecoveryEmail } = useUser();

    const { isXs, isSm, isMd, isLg, isXl, isXxl } = useBreakpoints();

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
        <Container className='min-vh-100 d-flex justify-content-center align-items-center'>
            <Row className='form__row w-100'>
                <Col className={`form__col-reset-img ${(isXs || isSm) && 'd-none'}`}>
                </Col>
                <Col className='form__col d-flex justify-content-center align-items-center w-100'>
                    <Form className={(isXs) ? 'w-100' : 'w-75'}>
                        {/* Form header */}
                        <div className='text-center mb-4'>
                            <h3 className='mb-2'>Reset Your Password</h3>
                            <p className='text-muted'>Enter your new password below</p>
                        </div>

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

                        <Button
                            onClick={onPasswrodChangeClick}
                            disabled={isResetPasswordLoading || !newPassword || !confirmNewPassword}
                            className='w-100 mb-3'
                        >
                            {!isResetPasswordLoading ? 'Update Password' : 'Updating...'}
                        </Button>

                        {resetPsswdSuccessMsg && (
                            <div className='text-center mb-3'>
                                {resetPsswdSuccessMsg}
                            </div>
                        )}

                        {resetPsswdErrorMsg && (
                            <div className='text-center mb-3'>
                                {resetPsswdErrorMsg}
                            </div>
                        )}

                        {hasRecoveryLinkExpired && (
                            <div className='text-center mb-3'>
                                <div className=''>
                                    <strong>Link Expired</strong><br />
                                    Your recovery link has expired. Please request a new one.
                                </div>
                                <Link
                                    to='/forgot-password'
                                    className='btn btn-outline-primary'
                                >
                                    Get New Recovery Link
                                </Link>
                            </div>
                        )}

                        {/* <div className='text-center'>
                            <div className='mb-2'>
                                <span className='text-muted'>Remember your password? </span>
                                <Link to='/sign-in' className='text-decoration-none fw-medium'>
                                    Sign in
                                </Link>
                            </div>
                            <div>
                                <span className='text-muted'>Need help? </span>
                                <Link to='/forgot-password' className='text-decoration-none fw-medium'>
                                    Get recovery email
                                </Link>
                            </div>
                        </div> */}
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
