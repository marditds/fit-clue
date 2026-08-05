import { useState, useEffect } from 'react';
import { useOutletContext, Outlet } from 'react-router-dom';
import { useBreakpoints } from '../../../lib/hooks/useBreakpoints';
import { Sidebar } from '../../../components/Dashboard/Sidebar';
import { ScrollToTop } from '../../../components/ScrollToTop/ScrollToTop';
import { DashboardLayout } from '../../../components/Dashboard/DashboardLayout';
import { LoadingComponent, LoadingPage } from '../../../components/Loading/Loading';
import { useUser } from '../../../lib/hooks/useUser';
import { devLog } from '../../../lib/utils/devConsole';
import { Col, Container, Row } from 'react-bootstrap';

const Dashboard = () => {

    const { userId, setUserId,
        email, setEmail,
        username, setUsername,
        setIsLoggedIn, setIsSessionInProgress, isAppLoading, isSignOutInProgress } = useOutletContext();

    const [contributorScore, setContributorScore] = useState(0);
    const [isDashboardLoading, setIsDashboardLoading] = useState(false);

    const { fetchUserContributionScore } = useUser();

    const { isXs } = useBreakpoints();

    useEffect(() => {
        const getUserContributionScore = async () => {
            try {
                setIsDashboardLoading(true);
                const s = await fetchUserContributionScore(userId);

                devLog('myScore:', s)

                setContributorScore(s);

            } catch (error) {
                devError('Error fetching user\'s contributor score:', error);
            } finally {
                setIsDashboardLoading(false);
            }
        }
        if (userId) {
            getUserContributionScore();
        }
    }, [userId])

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

    if (isDashboardLoading) {
        return (
            <Container>
                <LoadingPage loadingText='Loading your dashboard' />
            </Container>
        )
    }

    return (
        <DashboardLayout
            colOneContent={
                <Sidebar username={username} contributorScore={contributorScore} />
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
