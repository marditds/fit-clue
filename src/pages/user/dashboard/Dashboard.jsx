import { useEffect } from 'react';
import { useOutletContext, Link, Outlet } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { LoadingPage } from '../../../components/Loading/Loading';
import { useBreakpoints } from '../../../lib/hooks/useBreakpoints';
import { Sidebar } from '../../../components/Dashboard/Sidebar';
import { OffcanvasSidebar } from '../../../components/Dashboard/OffcanvasSidebar';

const Dashboard = () => {

    const { userId, setUserId,
        email, setEmail,
        username, setUsername,
        setIsLoggedIn, setIsSessionInProgress } = useOutletContext();


    return (
        <Container>

            <Row>

                <Sidebar
                    username={username}
                />

                {/* Dashboard content */}
                <Outlet context={{
                    userId, setUserId,
                    email, setEmail,
                    username, setUsername,
                    setIsLoggedIn, setIsSessionInProgress
                }} />

            </Row>

        </Container>
    )
}

export default Dashboard;
