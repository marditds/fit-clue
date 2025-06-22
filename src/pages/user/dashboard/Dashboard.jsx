import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useUser } from '../../../lib/hooks/useUser';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

export const Dashboard = () => {

    const { getUserAccount, updateUserPassword } = useUser();

    const { userId, userEmail, username, isLoggedIn, setUsername } = useOutletContext();

    const [isDashboardLoading, setIsDashboardLoading] = useState(false);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordRentered, setNewPasswordRentered] = useState('');
    const [successMsg, setSuccessMsg] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        const fetchUserAccount = async () => {
            setIsDashboardLoading(true);
            try {
                const userAccount = await getUserAccount();

                console.log('userAccount:', userAccount);

                setUsername(userAccount.name);

            } catch (error) {
                console.error('Error fetching user account:', error);
            } finally {
                setIsDashboardLoading(false);
            }
        }
        fetchUserAccount();
    }, [])

    const onUpdateUserPasswordClick = async () => {

        if (newPassword !== newPasswordRentered) {
            setErrorMsg('Your passwords do not match. Re-enter your new password.');
            setNewPassword('');
            setNewPasswordRentered('');
            return;
        }

        try {
            const res = await updateUserPassword(newPassword, oldPassword);

            if (typeof res === 'string') {
                setErrorMsg(res);
                return;
            }

            setErrorMsg('');
            setSuccessMsg('Password updated successfully.');

        } catch (error) {
            console.error('Error updating user password:', error);
        }
    }

    if (isDashboardLoading) {
        return (
            <Container>
                Loading your dashboard...
            </Container>
        )
    }

    return (
        <Container>
            {username}'s dashboard
            <Row>
                <Col>
                    <Form>
                        <Form.Group className="mb-3" controlId="oldPasswordField">
                            <Form.Label>Old password:</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="newPasswordField">
                            <Form.Label>New password:</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="newPasswordRenterField">
                            <Form.Label>Re-enter new password:</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={newPasswordRentered}
                                onChange={(e) => setNewPasswordRentered(e.target.value)}
                            />
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="button"
                            onClick={onUpdateUserPasswordClick}
                            disabled={!oldPassword || !newPassword || !newPasswordRentered}
                        >
                            Update
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
