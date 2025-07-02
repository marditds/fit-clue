import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useUser } from '../../../lib/hooks/useUser';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { LoadingComponent } from '../../../components/Loading/LoadingComponent';

export const Dashboard = () => {

    const { getUserFromCollectionById, updateUserPassword, updateUsernameInCollection, getUserPreferences } = useUser();

    const { userId, email, username, isLoggedIn, setUserId, setUsername } = useOutletContext();

    const [isDashboardLoading, setIsDashboardLoading] = useState(false);

    // Passwprd
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [psswdSuccessMsg, setPsswdSuccessMsg] = useState(null);
    const [psswdErrorMsg, setPsswdErrorMsg] = useState(null);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    // Username
    const [newUsername, setNewUsername] = useState(username);
    const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
    const [usrnmSuccessMsg, setUsrnmSuccessMsg] = useState(null);
    const [usrnmErrorMsg, setUsrnmErrorMsg] = useState(null);

    useEffect(() => {
        console.log({ userId, username });
    }, [userId, username])

    // Fetch user id
    useEffect(() => {
        const fetchUserPrefs = async () => {
            const prefs = await getUserPreferences();

            console.log('prefs in dashboard:', prefs);

            setUserId(prefs.prfile_id)
        }
        fetchUserPrefs();
    }, [])

    // Fetch username
    useEffect(() => {
        const fetchUserAccount = async () => {

            if (!userId) {
                return;
            }

            setIsDashboardLoading(true);
            try {
                const user = await getUserFromCollectionById(userId);

                console.log('userAccount:', user);

                setUsername(user.username);

            } catch (error) {
                console.error('Error fetching user account:', error);
            } finally {
                setIsDashboardLoading(false);
            }
        }
        fetchUserAccount();
    }, [userId])

    const onUpdateUserPasswordClick = async (e) => {

        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            setPsswdErrorMsg('Your passwords do not match. Re-enter your new password.');
            setNewPassword('');
            setConfirmNewPassword('');
            return;
        }

        try {
            setIsUpdatingPassword(true);

            const res = await updateUserPassword(newPassword, currentPassword);

            if (typeof res === 'string') {
                setPsswdErrorMsg(res);
                return;
            }

            setPsswdErrorMsg('');
            setPsswdSuccessMsg('Password updated successfully.');

        } catch (error) {
            console.error('Error updating user password:', error);
        } finally {
            setIsUpdatingPassword(false);
        }
    }

    const onUpdateUsernameClick = async (e) => {

        e.preventDefault();

        try {
            setIsUpdatingUsername(true);

            const res = await updateUsernameInCollection(userId, newUsername);

            setUsername(res.username);

        } catch (error) {
            console.error('Error updating username:', error);
        } finally {
            setIsUpdatingUsername(false);
        }
    }

    if (isDashboardLoading) {
        return (
            <Container>
                Loading your dashboard <span>{<LoadingComponent />}</span>...
            </Container>
        )
    }

    return (
        <Container>

            <Row>
                <Col xs={12} md={4} className='border'>

                    {/* User's information */}
                    <Row className='sticky-top'>
                        <Col className='p-4 text-center'>
                            <h2 className=''>
                                {username}
                            </h2>
                            <p className='mb-0'>
                                {email}
                            </p>
                        </Col>
                    </Row>

                </Col>

                <Col className='border'>

                    {/* Dashboard title */}
                    <Row>
                        <Col className='px-4 pt-4'>
                            <h3 className='fw-bold'>
                                Account Settings
                            </h3>
                            <p>
                                Manage your account information and security settings
                            </p>
                        </Col>
                    </Row>

                    {/* Username update */}
                    <Row className='w-100'>
                        <Col className='px-4 py-4'>
                            <h4>
                                Username
                            </h4>

                            <p className='text-muted'>
                                Your username must be unique. Your username will be visible to others.
                            </p>

                            <Form>
                                <Form.Group className='mb-3' controlId='newUsernameField'>
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter your new username'
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                    />
                                </Form.Group>

                                <Button
                                    type='button'
                                    onClick={onUpdateUsernameClick}
                                    disabled={
                                        !newUsername ||
                                        newUsername.includes(' ') ||
                                        newUsername === username
                                    }
                                    className='w-100'
                                >
                                    {!isUpdatingUsername ? 'Update Username' : <LoadingComponent />}
                                </Button>

                                <Form.Text className='text-danger'>
                                    {usrnmSuccessMsg || usrnmErrorMsg}
                                </Form.Text>
                            </Form>
                        </Col>
                    </Row>

                    <hr />

                    {/* Password update */}
                    <Row>
                        <Col className='px-4 py-4'>
                            <h4>
                                Password
                            </h4>

                            <p className='text-muted'>
                                Keep your account secure with a strong password. We recommend using at least 8 characters with a mix of letters, numbers, and symbols.
                            </p>

                            <Form>
                                <Form.Group className='mb-3' controlId='currentPasswordField'>
                                    <Form.Label>Current password</Form.Label>
                                    <Form.Control
                                        type='password'
                                        placeholder='Enter your current password'
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                </Form.Group>

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
                                        placeholder='Confirm your new password'
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    />
                                </Form.Group>

                                <Button
                                    type='button'
                                    onClick={onUpdateUserPasswordClick}
                                    disabled={!currentPassword || !newPassword || !confirmNewPassword || isUpdatingPassword}
                                    className='w-100'
                                >
                                    {!isUpdatingPassword ? 'Update Password' : <LoadingComponent />}
                                </Button>

                                <Form.Text className='text-danger'>
                                    {psswdErrorMsg || psswdSuccessMsg}
                                </Form.Text>
                            </Form>
                        </Col>
                    </Row>

                </Col>
            </Row>

        </Container>
    )
}
