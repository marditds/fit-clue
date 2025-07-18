import { useOutletContext, Outlet } from 'react-router-dom';
import { useBreakpoints } from '../../../lib/hooks/useBreakpoints';
import { Sidebar } from '../../../components/Dashboard/Sidebar';
import { ScrollToTop } from '../../../components/ScrollToTop/ScrollToTop';
import { LayoutDashboard } from '../../../components/Dashboard/LayoutDashboard';

const Dashboard = () => {

    const { userId, setUserId,
        email, setEmail,
        username, setUsername,
        setIsLoggedIn, setIsSessionInProgress } = useOutletContext();

    const { isXs, isSm, isMd } = useBreakpoints();

    return (
        <LayoutDashboard
            colOneContent={
                <Sidebar username={username} />
            }
            colOneClassName='border'
            colOneStyle={
                { minHeight: !isXs && !isSm && !isMd ? 'calc(100vh - 112px)' : 'fit-content' }
            }
            colTwoClassName='border'
            scrollTop={<ScrollToTop />}
        >
            <Outlet context={{
                userId, setUserId,
                email, setEmail,
                username, setUsername,
                setIsLoggedIn, setIsSessionInProgress
            }} />
        </LayoutDashboard>
    )
}

export default Dashboard;
