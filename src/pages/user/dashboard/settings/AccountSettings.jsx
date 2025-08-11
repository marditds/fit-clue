import { Col, Row, Button, Form } from 'react-bootstrap';
import { DashboardForm } from '../../../../components/Form/DashboardForm';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useUser } from '../../../../lib/hooks/useUser';
import { useState } from 'react';
import { Icon } from '../../../../components/Accessories/Icon';
import { PlainModal } from '../../../../components/Modals/Modals';
import { LoadingComponent } from '../../../../components/Loading/Loading';

export const AccountSettings = () => {

    const navigate = useNavigate();

    const { userId, setUserId,
        email, setEmail,
        username, setUsername,
        setIsLoggedIn, setIsSessionInProgress } = useOutletContext();

    const { updateUserPassword, updateUsernameInCollection, deleteUserFromPlatform } = useUser();

    // Username
    const [newUsername, setNewUsername] = useState(username);
    const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
    const [usrnmSuccessMsg, setUsrnmSuccessMsg] = useState(null);
    const [usrnmErrorMsg, setUsrnmErrorMsg] = useState(null);

    // Password
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [psswdSuccessMsg, setPsswdSuccessMsg] = useState(null);
    const [psswdErrorMsg, setPsswdErrorMsg] = useState(null);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    //Account delete
    const [isDeleteInProgress, setIsDeleteInProgress] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalFooter, setShowModalFooter] = useState(false);

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

    const removeUserFromPlatform = async () => {

        setIsDeleteInProgress(true);
        try {

            const res = await deleteUserFromPlatform();

            console.log('res.success:', res.success);

            if (res.success === true) {

                setUserId(null);
                setIsLoggedIn(false);
                setIsSessionInProgress(false);
                setUsername('');
                setEmail('');
                setShowModalFooter(false);
                setShowModal(false);

                localStorage.removeItem('authUserId');

                navigate('/');
            }

            if (res.success === false) {
                setShowModalFooter(true);
            }
        } catch (error) {
            console.error('Error removing user from platform:', error);
        } finally {
            setIsDeleteInProgress(false);
        }
    }

    const handleModalClose = () => {
        setShowModal(false);
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

    return (
        <>
            {/* Dashboard title */}
            <Row>
                <Col className='px-4 pt-4 pb-0 px-lg-5 pt-lg-5 pb-lg-0'>
                    <h3 className='fw-bold'>
                        <Icon
                            className='bi bi-gear'
                            marginEndSize={'3'}
                        />
                        Account Settings
                    </h3>
                    <p>
                        Manage your account information and security settings
                    </p>
                </Col>
            </Row>

            <hr />

            {/* Email */}
            <Row>
                <Col className='p-4 p-lg-5'>
                    <h4>
                        <Icon className='bi bi-at'
                            marginEndSize={'2'}
                        />Email
                    </h4>
                    <p className='text-muted'>
                        This email is linked to your FitClue registration and cannot be changed.
                    </p>
                    <Form>
                        <Form.Group
                            as={Row}
                            controlId='userEmail'
                        >
                            <Col>
                                <Form.Control
                                    readOnly
                                    defaultValue={email}
                                />
                            </Col>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>

            <hr />

            {/* Username update */}
            <Row>
                <Col className='p-4 p-lg-5'>
                    <DashboardForm
                        title={<><Icon className='bi bi-hash' marginEndSize={'2'} />Username</>}
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
                        title={<><Icon className='bi bi-lock' marginEndSize={'2'} />Password</>}
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
                        <Icon className='bi bi-exclamation-square' marginEndSize={'2'} />
                        Delete Account
                    </h4>
                    <p className='text-muted'>
                        This action is irreversible. You will not be able to recover your account.
                    </p>

                    <Button
                        onClick={async () => {
                            setShowModal(true);
                            await removeUserFromPlatform();
                        }}
                        className='w-100'
                    >
                        Delete Account
                    </Button>
                </Col>
            </Row>

            <PlainModal
                modalText={
                    isDeleteInProgress ?
                        <LoadingComponent loadingText='Deleting account' />
                        :
                        'Failed deleting account. Please try again later.'
                }
                showModal={showModal}
                showModalFooter={showModalFooter}
                handleClose={handleModalClose}
            />
        </>
    )
} 