import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useUser } from '../../../lib/hooks/useUser';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { DashboardForm } from '../../../components/Form/DashboardForm';
import { LoadingComponent } from '../../../components/Loading/LoadingComponent';

export const Dashboard = () => {

    const { updateUserPassword, updateUsernameInCollection, deleteUserFromPlatform } = useUser();

    const { userId, email, username, setUsername } = useOutletContext();

    const [isDashboardLoading, setIsDashboardLoading] = useState(false);

    // Username
    const [newUsername, setNewUsername] = useState(username);
    const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
    const [usrnmSuccessMsg, setUsrnmSuccessMsg] = useState(null);
    const [usrnmErrorMsg, setUsrnmErrorMsg] = useState(null);

    // Passwprd
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [psswdSuccessMsg, setPsswdSuccessMsg] = useState(null);
    const [psswdErrorMsg, setPsswdErrorMsg] = useState(null);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    useEffect(() => {
        console.log({ userId, username });
    }, [userId, username])

    const onUpdateUsernameClick = async () => {

        try {
            setIsUpdatingUsername(true);

            const res = await updateUsernameInCollection(userId, newUsername);

            console.log(res);

            if (typeof res === 'string') {
                setUsrnmErrorMsg(res);
                setUsrnmSuccessMsg('');
                return;
            }

            setUsername(res.username);
            setUsrnmErrorMsg('');
            setUsrnmSuccessMsg('Username updated successfully.');

        } catch (error) {
            console.error('Error updating username:', error);
        } finally {
            setIsUpdatingUsername(false);
        }
    }

    const onUpdateUserPasswordClick = async () => {

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
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');

        } catch (error) {
            console.error('Error updating user password:', error);
        } finally {
            setIsUpdatingPassword(false);
        }
    }

    const onDeleteUserClick = async () => {
        await deleteUserFromPlatform();
    }

    const updateUsernameFields = [
        {
            id: 'newUsernameField',
            label: 'Username',
            type: 'text',
            placeholder: 'Enter your new username',
            value: newUsername,
            onChange: (e) => setNewUsername(e.target.value),
        },
    ];

    const updatePasswordFields = [
        {
            id: 'currentPasswordField',
            label: 'Current password',
            type: 'password',
            placeholder: 'Enter your current password',
            value: currentPassword,
            onChange: (e) => setCurrentPassword(e.target.value),
        },
        {
            id: 'newPasswordField',
            label: 'New password',
            type: 'password',
            placeholder: 'Enter your new password',
            value: newPassword,
            onChange: (e) => setNewPassword(e.target.value),
        },
        {
            id: 'newPasswordRenterField',
            label: 'Confirm new password',
            type: 'password',
            placeholder: 'Confirm your new password',
            value: confirmNewPassword,
            onChange: (e) => setConfirmNewPassword(e.target.value),
        },
    ];

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
                        <Col className='p-4 p-lg-5 text-center'>
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
                        <Col className='px-4 pt-4 pb-0 px-lg-5 pt-lg-5 pb-lg-0'>
                            <h3 className='fw-bold'>
                                Account Settings
                            </h3>
                            <p>
                                Manage your account information and security settings
                            </p>
                        </Col>
                    </Row>

                    {/* Username update */}
                    <Row>
                        <Col className='p-4 p-lg-5'>
                            <DashboardForm
                                title='Username'
                                description='Your username must be unique. Your username will be visible to others.'
                                fields={updateUsernameFields}
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    onUpdateUsernameClick();
                                }}
                                buttonLabel='Update Username'
                                isLoading={isUpdatingUsername}
                                isDisabled={
                                    !newUsername ||
                                    newUsername.includes(' ') ||
                                    newUsername === username
                                }
                                successMsg={usrnmSuccessMsg}
                                errorMsg={usrnmErrorMsg}
                            />

                        </Col>
                    </Row>

                    <hr />

                    {/* Password update */}
                    <Row>
                        <Col className='p-4 p-lg-5'>
                            <DashboardForm
                                title='Password'
                                description='Keep your account secure with a strong password. We recommend using at least 8 characters with a mix of letters, numbers, and symbols.'
                                fields={updatePasswordFields}
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    onUpdateUserPasswordClick();
                                }}
                                buttonLabel='Update Password'
                                isLoading={isUpdatingPassword}
                                isDisabled={
                                    currentPassword.length < 8 ||
                                    !currentPassword || !newPassword || !confirmNewPassword || isUpdatingPassword
                                }
                                successMsg={psswdSuccessMsg}
                                errorMsg={psswdErrorMsg}
                            />

                        </Col>
                    </Row>

                    <hr />

                    {/* Account delete */}
                    <Row>
                        <Col className='p-4 p-lg-5'>

                            <h4>
                                Delete Account
                            </h4>
                            <p className='text-muted'>
                                This action is irreversible. You will not be able to recover your account.
                            </p>

                            <Button
                                onClick={onDeleteUserClick}
                                className='w-100'
                            >
                                Delete Account
                            </Button>
                        </Col>
                    </Row>

                </Col>
            </Row>

        </Container>
    )
}
