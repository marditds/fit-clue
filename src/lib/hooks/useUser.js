import { createUser as makeUser, signInUser as loginUser, getUserSession as fetchUserSession, deleteUserSession as removeUserSession, getUserAccount as fetchUserAccount, updateUserPassword as changeUserPassword, createPasswordRecoveryEmail as makePasswordRecoveryEmail, updatePasswordFromRecoveryEmail as restorePasswordFromRecoveryEmail, getUserPreferences as fetchUserPreferences, getUserFromCollectionById as fetchUserFromCollectionById, updateUsernameInCollection as renewUsernameInCollection, deleteUserFromPlatform as removeUserFromPlatform } from '../context/dbhandler';
import { useUserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export const useUser = () => {

    const {
        setUserId, setUsername, setEmail,
        setIsLoggedIn,
        setIsSessionInProgress,
        setIsSignOutSucessful,
        setSignOutSucessMsg
    } = useUserContext();

    const navigate = useNavigate();

    const createUser = async (email, password, name) => {
        try {
            const user = await makeUser(email, password, name);
            return user;
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }

    const updateUsernameInCollection = async (userId, username) => {
        try {
            const res = await renewUsernameInCollection(userId, username);
            return res;
        } catch (error) {
            console.error('Error updating username in collection:', error);
        }
    }

    const getUserPreferences = async () => {
        try {
            const userPreferences = await fetchUserPreferences();

            return userPreferences;

        } catch (error) {
            console.error('Error fetching user prferences:', error);
        }
    }

    const signInUser = async (email, password) => {
        try {
            const user = await loginUser(email, password);
            return user;
        } catch (error) {
            console.error('Error signing in user:', error);
        }
    }

    const getUserFromCollectionById = async (userId) => {
        try {
            const user = await fetchUserFromCollectionById(userId);

            return user;
        } catch (error) {
            console.error('Error getting user from collection:', error);
        }
    }

    const getUserSession = async () => {
        try {
            const session = await fetchUserSession();
            return session;
        } catch (error) {
            console.error('Error getting user session details:', error);
        }
    }

    const createPasswordRecoveryEmail = async (email) => {
        try {
            const res = await makePasswordRecoveryEmail(email);

            return res;
        } catch (error) {
            console.error('Error creating passowrd recovery email:', error);
        }
    }

    const updatePasswordFromRecoveryEmail = async (userId, secret, newPassword) => {
        try {
            const res = await restorePasswordFromRecoveryEmail(userId, secret, newPassword);

            return res;
        } catch (error) {
            console.error('Error updating user password via recovery email:', error);
        }
    }

    const updateUserPassword = async (newPassword, oldPassword) => {
        try {
            const user = await changeUserPassword(newPassword, oldPassword);
            return user;
        } catch (error) {
            console.error('Error updating user password:', error);
        }
    }

    const getUserAccount = async () => {
        try {
            const user = await fetchUserAccount();
            return user;
        } catch (error) {
            console.error('Error getting user session details:', error);
        }
    }

    const deleteUserSession = async () => {
        try {
            const removeSessionRes = await removeUserSession();
            return removeSessionRes;
        } catch (error) {
            console.error('Error getting user session details:', error);
        }
    }

    const onSignOutClick = () => {
        navigate('/sign-out');
    }

    const onSignOut = async () => {
        try {
            const deleteSessionRes = await deleteUserSession();

            if (deleteSessionRes.success === true) {

                setSignOutSucessMsg('Signed out successfully.');
                setIsSignOutSucessful(true);

                setUserId(null);
                setIsLoggedIn(false);
                setIsSessionInProgress(false);
                setUsername('');
                setEmail('');

                // localStorage.removeItem('authUserId');

                navigate('/sign-in');
            } else {
                setSignOutSucessMsg('Failed to sign out. Please try again later.')
                setIsSignOutSucessful(false);
            }

        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    // Server-side functions
    const deleteUserFromPlatform = async () => {
        try {
            const res = await removeUserFromPlatform();
            return res;
        } catch (error) {
            console.error('Error deleting user from platform.', error);
        }
    }


    return { createUser, signInUser, getUserSession, deleteUserSession, getUserAccount, updateUserPassword, createPasswordRecoveryEmail, updatePasswordFromRecoveryEmail, getUserPreferences, getUserFromCollectionById, updateUsernameInCollection, deleteUserFromPlatform, onSignOutClick, onSignOut };
}
