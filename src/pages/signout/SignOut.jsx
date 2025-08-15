import { useEffect } from 'react';
import { useUser } from '../../lib/hooks/useUser';
import { LoadingPage } from '../../components/Loading/Loading';

const SignOut = () => {

    const { onSignOut } = useUser();

    useEffect(() => {
        onSignOut();
    }, []);

    return <LoadingPage loadingText='Signing out' />;
}

export default SignOut;