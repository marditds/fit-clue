import { useOutletContext, Outlet } from 'react-router-dom';
import { useBreakpoints } from '../../../lib/hooks/useBreakpoints';
import { Sidebar } from '../../../components/Dashboard/Sidebar';
import { ScrollToTop } from '../../../components/ScrollToTop/ScrollToTop';
import { DashboardLayout } from '../../../components/Dashboard/DashboardLayout';

const Dashboard = () => {

    const { userId, setUserId,
        email, setEmail,
        username, setUsername,
        setIsLoggedIn, setIsSessionInProgress } = useOutletContext();

    const { isXs, isSm, isMd } = useBreakpoints();

    return (
        <DashboardLayout
            colOneContent={
                <Sidebar username={username} />
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
