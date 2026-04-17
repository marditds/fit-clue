import { redirect } from 'react-router-dom';
import { getUserAccount } from '../context/dbhandler';

export const isUserLoggedIn = async () => {

    const user = await getUserAccount();

    return !!user?.$id;
};

export const redirectIfLoggedIn = async (path = '') => {
    if (await isUserLoggedIn()) {
        return redirect(`/${path}`);
    }
    return null;
};

export const redirectIfNotLoggedIn = async (path = '') => {
    if (!(await isUserLoggedIn())) {
        return redirect(`/${path}`);
    }
    return null;
}