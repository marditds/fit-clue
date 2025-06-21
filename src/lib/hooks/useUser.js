import { createUser as makeUser, signInUser as loginUser, getUserSession as fetchUserSession } from '../context/dbhandler';

export const useUser = () => {

    const createUser = async (email, password, name) => {
        try {
            const user = await makeUser(email, password, name);
            return user;
        } catch (error) {
            console.error('Error creating user:', error);
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

    const getUserSession = async () => {
        try {
            const session = await fetchUserSession();
            return session;
        } catch (error) {
            console.error('Error getting user session details:', error);
        }
    }

    return { createUser, signInUser, getUserSession };
}
