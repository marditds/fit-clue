import { redirect } from 'react-router-dom';

export const isUserLoggedIn = () => {
    return !!localStorage.getItem('authUserId');
}

export const redirectIfLoggedIn = (path = '') => {
    if (isUserLoggedIn()) {
        return redirect(`/${path}`);
    }
    return null;
}

export const redirectIfNotLoggedIn = (path = '') => {
    if (!isUserLoggedIn()) {
        return redirect(`/${path}`);
    }
    return null;
}