import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Container, Dropdown, Form, Nav, Navbar } from 'react-bootstrap';
import { useUserContext } from '../../lib/context/UserContext';
import { useUser } from '../../lib/hooks/useUser';
import { SearchForm } from '../Form/SearchForm';
import './Navigation.css';
import { Icon } from '../Accessories/Icon';

const NavigationBar = () => {

    const navigate = useNavigate();

    const location = useLocation();

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

                        <Nav.Link
                            as={Link}
                            to='/'
                            className='ms-5'
                        >
                            {!isLoggedIn ? 'Home' : 'The Latest'}
                        </Nav.Link>

                        {!isLoggedIn &&
                            <>
                                <Nav.Link
                                    as={Link}
                                    to='/'
                                    className='ms-5'
                                >
                                    Features
                                </Nav.Link>

                                <Nav.Link
                                    as={Link}
                                    to='/'
                                    className='ms-5'
                                >
                                    About
                                </Nav.Link>

                                <Nav.Link
                                    as={Link}
                                    to='/'
                                    className='ms-5'
                                >
                                    Contact
                                </Nav.Link>
                            </>
                        }

                        {
                            !location.pathname.startsWith('/search') &&

                            <Form
                                className={`d-flex align-items-center ${!isLoggedIn ? 'ms-auto w-25' : 'mx-auto w-50'}`}
                                onSubmit={handleSearch}>
                                <SearchForm
                                    searchFieldPlacement='NavigationBar'
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                />
                            </Form>
                        }

                        {
                            isLoggedIn &&
                            <>
                                <Nav.Link
                                    as={Link}
                                    to='/post/create'
                                    className='me-2 d-flex justify-content-center align-items-center'
                                >
                                    Create<i className='bi bi-plus-circle ms-1 d-flex justify-content-center align-items-center' />
                                </Nav.Link>

                                <Dropdown drop='start' className='navbar__dropdown' >

                                    <Dropdown.Toggle id='dropdown-profile'>
                                        <Icon className='bi bi-person-circle fs-4 d-flex justify-content-center align-align-items-center' />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item
                                            as={Link}
                                            to='dashboard'
                                            className='px-2'
                                        >
                                            Dashboard
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            as={Button}
                                            onClick={onSignOutClick}
                                        >
                                            Sing out
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </>
                        }

                        {
                            !isLoggedIn &&
                            <>
                                <Nav.Link
                                    as={Link}
                                    to='/sign-up'
                                    className={`navbar__btn sign-up border ${location.pathname.startsWith('/search') ? 'ms-auto' : 'ms-2'}`}
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
                            </>
                        }

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavigationBar;