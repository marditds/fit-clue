import { useOutletContext, Outlet } from 'react-router-dom';
import { useBreakpoints } from '../../../lib/hooks/useBreakpoints';
import { Sidebar } from '../../../components/Dashboard/Sidebar';
import { ScrollToTop } from '../../../components/ScrollToTop/ScrollToTop';
import { DashboardLayout } from '../../../components/Dashboard/DashboardLayout';
import { LoadingPage } from '../../../components/Loading/Loading';
import { useUser } from '../../../lib/hooks/useUser';

const Dashboard = () => {

    const { userId, setUserId,
        email, setEmail,
        username, setUsername,
        setIsLoggedIn, setIsSessionInProgress, isAppLoading, isSignOutInProgress } = useOutletContext();

    const { isXs } = useBreakpoints();

    const { onSignOutClick } = useUser();

    if (isAppLoading) {
        return <LoadingPage loadingText='Loading your dashboard' />
    }

    if (isSignOutInProgress) {
        return (
            <Container>
                <LoadingPage loadingText='Signing out' />
            </Container>
        );
    }

    return (
        <DashboardLayout
            colOneContent={
                <Sidebar username={username} onSignOutClick={onSignOutClick} />
            }
            colOneClassName={!isXs ? 'border border-end-0' : ''}
            colTwoClassName='border'
            scrollTop={<ScrollToTop />}
        >
            <Outlet context={{
                userId, setUserId,
                email, setEmail,
                username, setUsername,
                setIsLoggedIn, setIsSessionInProgress
            }} />
        </DashboardLayout>
    )
}

export default Dashboard;
