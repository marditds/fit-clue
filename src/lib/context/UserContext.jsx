import { createContext, useContext, useEffect, useState } from 'react';
import { getUserAccount, getUserFromCollectionById } from './dbhandler';
import { devLog } from '../utils/devConsole';

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [email, setEmail] = useState(null);
    const [username, setUsername] = useState('');

    const [isAppLoading, setIsAppLoading] = useState(false);
    const [isCheckEmailExistanceLoading, setIsCheckEmailExistanceLoading] = useState(false);
    const [isSessionInProgress, setIsSessionInProgress] = useState(false);
    const [isSignOutInProgress, setIsSignOutInProgress] = useState(false);
    const [isSignInBtnClicked, setIsSignInBtnClicked] = useState(false);
    const [isSignOutSucessful, setIsSignOutSucessful] = useState(false);
    const [signOutSucessMsg, setSignOutSucessMsg] = useState('');

    // Checkig Session Status
    useEffect(() => {
        const checkingSessionStatus = async () => {

            if (isSignOutInProgress) {
                devLog('Sign out in progress. Not checking session status.');
                return;
            }

            try {
                devLog('START - Checking session status...');

                setIsAppLoading(true);

                if (location.pathname === '/' && isSignOutInProgress) {
                    devLog('On root path during sign-out. Skipping session check.');
                    return;
                }

                const user = await getUserAccount();

                if (!user) {
                    devLog('No session found.');
                    setIsSessionInProgress(false);
                    setIsLoggedIn(false);
                    return;
                }

                devLog('userIdInSession', user.$id);

                setIsSessionInProgress(true);
                setUserId(user.$id);
                setUsername(user.name);
                setEmail(user.email);
                setIsLoggedIn(true);

            } catch (error) {
                console.error('Error checking session status:', error);
            } finally {
                devLog('FINISH - Checking session status...');
                setIsAppLoading(false);
            }
        };
        checkingSessionStatus();
    }, [isSignOutInProgress])

    return (
        <UserContext.Provider
            value={{
                isLoggedIn, setIsLoggedIn,
                userId, setUserId,
                email, setEmail,
                username, setUsername,
                isAppLoading, setIsAppLoading,
                isCheckEmailExistanceLoading, setIsCheckEmailExistanceLoading,
                user, setUser,
                isSessionInProgress, setIsSessionInProgress,
                isSignOutInProgress, setIsSignOutInProgress,
                isSignInBtnClicked, setIsSignInBtnClicked,
                isSignOutSucessful, setIsSignOutSucessful,
                signOutSucessMsg, setSignOutSucessMsg
            }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
