import { useEffect } from 'react';
import { useUser } from '../../lib/hooks/useUser';
import { LoadingPage } from '../../components/Loading/Loading';
import { useDocumentTitle } from '../../lib/hooks/useDocumentTitle';

const SignOut = () => {

    useDocumentTitle(`Signing out... | FitClue`);

    const { onSignOut } = useUser();

    useEffect(() => {
        onSignOut();
    }, []);

    return <LoadingPage loadingText='Signing out' />;
}

export default SignOut;