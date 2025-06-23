import { useEffect, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../lib/hooks/useUser';

export const ResetPassword = () => {

    const navigate = useNavigate();

    const { updatePasswordFromRecoveryEmail } = useUser();

    const [userId, setUserId] = useState(null);
    const [secret, setSecret] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isResetPasswordLoading, setIsResetPasswordLoading] = useState(false);
    const [resetPsswdSuccessMsg, setResetPsswdSuccessMsg] = useState(null);
    const [resetPsswdErrorMsg, setResetPsswdErrorMsg] = useState(null);

    // Get Reset Details
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setUserId(params.get('userId'));
        setSecret(params.get('secret'));

        console.log('THESE ARE THE PARAMS:', params);

        if (params.size === 0) {
            navigate('/');
        }

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
            }

            console.log('res in onPasswrodChange', res);

            setResetPsswdSuccessMsg('Your password was changed successfully.')
            setResetPsswdErrorMsg('');

        } catch (error) {
            console.error('Error resetting passowrd:', error);
            setResetPsswdErrorMsg('Something went wrong. Please try again later.');
        } finally {
            setIsResetPasswordLoading(false);
        }
    }

    return (
        <Container>
            <Row>
                <Col>
                    <Form>
                        <Form.Group className='mb-3' controlId='newPasswordField'>
                            <Form.Label>New password:</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder='Password'
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className='mb-3' controlId='newPasswordRenterField'>
                            <Form.Label>Re-enter new password:</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder='Password'
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Button onClick={onPasswrodChangeClick}>
                            Reset Password
                        </Button>

                        <Form.Text>
                            {resetPsswdSuccessMsg || resetPsswdErrorMsg}
                        </Form.Text>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
