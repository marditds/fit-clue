import { createUser as makeUser, signInUser as loginUser } from '../context/dbhandler';

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

    return { createUser, signInUser };
}
