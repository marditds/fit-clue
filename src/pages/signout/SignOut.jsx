import { useNavigate, useOutletContext } from "react-router-dom";
import { useUser } from "../../lib/hooks/useUser";
import { LoadingPage } from "../../components/Loading/Loading";

const SignOut = () => {

    const navigate = useNavigate();

    const {
        setUserId, setIsLoggedIn,
        setIsSessionInProgress, setUsername,
        setEmail
    } = useOutletContext();

    const { deleteUserSession } = useUser();

    useEffect(() => {
        (async () => {
            setUserId(null);
            setIsLoggedIn(false);
            setIsSessionInProgress(false);
            setUsername('');
            setEmail('');

            try {
                await deleteUserSession();
                localStorage.removeItem('authUserId');
            } catch (e) {
                console.error(e);
            } finally {
                navigate('/');
            }
        })();
    }, []);

    return <LoadingPage loadingText="Signing out" />;
}

export default SignOut;
