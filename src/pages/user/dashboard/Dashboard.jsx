import { useEffect } from 'react';
import { useOutletContext, Link, Outlet } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { LoadingPage } from '../../../components/Loading/Loading';

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
                <Col
                    xs={12} sm={4} lg={3}
                    className='border'
                    style={{
                        minHeight: 'calc(100vh - 112px)'
                    }}
                >
                    {/* User's information */}
                    <Row
                        className='sticky-top'
                    >
                        <Col className='p-4 p-lg-5 text-center'>
                            <h2 className=''>
                                {username}
                            </h2>
                        </Col>

                        <Col className='px-4 px-lg-5'>
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
