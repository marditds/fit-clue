import { useEffect } from 'react';
import { useOutletContext, Link, Outlet } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { LoadingPage } from '../../../components/Loading/Loading';
import { AccountSettings } from './settings/AccountSettings';
import { SavedPosts } from './saved-posts/SavedPosts';

const Dashboard = () => {

    const { userId, setUserId,
        email, setEmail,
        username, setUsername,
        setIsLoggedIn, setIsSessionInProgress } = useOutletContext();



    useEffect(() => {
        console.log({ userId, username });
    }, [userId, username])

    return (
        <Container>

            <Row>
                <Col xs={12} md={4} className='border'>

                    {/* User's information */}
                    <Row className='sticky-top flex-column'>
                        <Col className='p-4 p-lg-5 text-center'>
                            <h2 className=''>
                                {username}
                            </h2>
                            <p className='mb-0'>
                                {email}
                            </p>
                        </Col>
                        <Col>
                            <ul className='list-unstyled'>
                                <li>
                                    <Link to='settings'>
                                        Account Settings
                                    </Link>
                                </li>
                                <li>
                                    <Link to='saved-posts'>
                                        Saved Posts
                                    </Link>
                                </li>
                            </ul>

                        </Col>
                    </Row>

                </Col>

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
