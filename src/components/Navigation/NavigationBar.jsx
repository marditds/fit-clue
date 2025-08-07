import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Container, Form, Nav, Navbar } from 'react-bootstrap';
import { useUserContext } from '../../lib/context/UserContext';
import { useUser } from '../../lib/hooks/useUser';
import { SearchForm } from '../Form/SearchForm';
import './Navigation.css';

const NavigationBar = () => {

    const navigate = useNavigate();

    const {
        setUserId, setUsername, setEmail,
        isLoggedIn, setIsLoggedIn,
        setIsSessionInProgress,
        setIsSignOutInProgress
    } = useUserContext();

    const { deleteUserSession } = useUser();

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search/${encodeURIComponent(searchTerm)}`);
        }
    };

    const onSignOutClick = async () => {

        setIsSignOutInProgress(true);

        try {

            setUserId(null);
            setIsLoggedIn(false);
            setIsSessionInProgress(false);
            setUsername('');
            setEmail('');

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
        <Navbar expand='lg' className='bg-body-tertiary'>
            <Container>
                <Navbar.Brand href='/'>React-Bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='w-100 d-flex align-items-center'>
                        <Nav.Link as={Link} to='/'>Home</Nav.Link>

                        <Nav.Link as={Link} to='/'>About</Nav.Link>

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
                            !location.pathname.startsWith('/search') &&

                            <Form className='d-flex align-items-center ms-auto' onSubmit={handleSearch}>
                                <SearchForm
                                    searchFieldPlacement='NavigationBar'
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                />
                            </Form>
                        }

                        {
                            !isLoggedIn ?
                                <>
                                    <Nav.Link
                                        as={Link}
                                        to='/sign-up'
                                        className='navbar__btn sign-up border ms-2'
                                    >
                                        Create Free Account
                                    </Nav.Link>
                                    <Nav.Link
                                        as={Link}
                                        to='/sign-in'
                                        className='navbar__btn sign-in border ms-2'
                                    >
                                        Sign in
                                    </Nav.Link>
                                </> :
                                <Nav.Link as={Button} onClick={onSignOutClick}>
                                    Sign out
                                </Nav.Link>
                        }

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavigationBar;