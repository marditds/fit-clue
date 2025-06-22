import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useUserContext } from '../../lib/context/UserContext';
import { useUser } from '../../lib/hooks/useUser';

const NavigationBar = () => {

    const navigate = useNavigate();

    const {
        setUserId,
        setSessionId,
        isLoggedIn, setIsLoggedIn,
        setIsSessionInProgress,
        setIsSignOutInProgress
    } = useUserContext();

    const { deleteUserSession } = useUser();

    const onSignOutClick = async () => {

        setIsSignOutInProgress(true);

        try {

            setSessionId(null);
            setUserId(null);
            setIsLoggedIn(false);
            setIsSessionInProgress(false);

            await deleteUserSession();

            localStorage.removeItem('authUserId');

        } catch (error) {
            console.error('Error signing out:', error);
        } finally {
            setIsSignOutInProgress(false);
            navigate('/');
        }
    }

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to='/'>Home</Nav.Link>

                        {
                            isLoggedIn &&
                            <><Nav.Link as={Link} to='/post/create'>
                                Create <i className='bi bi-plus-circle' />
                            </Nav.Link>
                                <Nav.Link as={Link} to='/dashboard'>
                                    Dashboard
                                </Nav.Link>
                            </>
                        }

                        {
                            !isLoggedIn ?
                                <><Nav.Link as={Link} to='/sign-up'>
                                    Sign up
                                </Nav.Link>
                                    <Nav.Link as={Link} to='/sign-in'>
                                        Sign in
                                    </Nav.Link> </> :
                                <Nav.Link as={Button} onClick={onSignOutClick}>
                                    Sign out
                                </Nav.Link>
                        }

                        {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">
                                Another action
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                                Separated link
                            </NavDropdown.Item>
                        </NavDropdown> */}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavigationBar;