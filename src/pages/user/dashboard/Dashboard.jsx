import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useUser } from '../../../lib/hooks/useUser';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { LoadingComponent } from '../../../components/Loading/LoadingComponent';

export const Dashboard = () => {

    const { getUserFromCollectionById, updateUserPassword, updateUsernameInCollection, getUserPreferences } = useUser();

    const { userId, userEmail, username, isLoggedIn, setUserId, setUsername } = useOutletContext();

    const [isDashboardLoading, setIsDashboardLoading] = useState(false);

    // Passwprd
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [successMsg, setSuccessMsg] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);


    // Username
    const [newUsername, setNewUsername] = useState('');
    const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);

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
            setErrorMsg('Your passwords do not match. Re-enter your new password.');
            setNewPassword('');
            setConfirmNewPassword('');
            return;
        }

        try {
            setIsUpdatingPassword(true);

            const res = await updateUserPassword(newPassword, oldPassword);

            if (typeof res === 'string') {
                setErrorMsg(res);
                return;
            }

            setErrorMsg('');
            setSuccessMsg('Password updated successfully.');

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
            {username}'s dashboard

            {/* Password update */}
            <Row>
                <Col>
                    <Form>
                        <Form.Group className='mb-3' controlId='oldPasswordField'>
                            <Form.Label>Old password:</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder='Password'
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                        </Form.Group>

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

                        <Button
                            type='button'
                            onClick={onUpdateUserPasswordClick}
                            disabled={!oldPassword || !newPassword || !confirmNewPassword || isUpdatingPassword}
                        >
                            {!isUpdatingPassword ? 'Update Password' : <LoadingComponent />}
                        </Button>

                        <Form.Text>
                            {errorMsg || successMsg}
                        </Form.Text>
                    </Form>
                </Col>
            </Row>

            {/* Username update */}
            <Row>
                <Col>
                    <Form>
                        <Form.Group className='mb-3' controlId='newUsernameField'>
                            <Form.Label>Username:</Form.Label>
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
                            disabled={!newUsername}
                        >
                            {!isUpdatingUsername ? 'Update Username' : <LoadingComponent />}
                        </Button>

                        <Form.Text>
                            {errorMsg || successMsg}
                        </Form.Text>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
