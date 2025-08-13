import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Container, Dropdown, Form, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { useUserContext } from '../../lib/context/UserContext';
import { useUser } from '../../lib/hooks/useUser';
import { SearchForm } from '../Form/SearchForm';
import './Navigation.css';
import { Icon } from '../Accessories/Icon';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';

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

    const { isXs, isSm, isMd } = useBreakpoints();

    const [searchTerm, setSearchTerm] = useState('');
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const isScreenWidthLargerThanMedium = !isXs && !isSm && !isMd;

    useEffect(() => {
        setShowOffcanvas(false);
    }, [location.pathname]);

    useEffect(() => {
        setSearchTerm('');
    }, [location.pathname])

    const handleCloseOffcanvas = () => {
        setShowOffcanvas(false)
    };

    const handleShowOffcanvas = () => {
        setShowOffcanvas(true)
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search/${encodeURIComponent(searchTerm)}`);
        }
    };

    const onSignOutClick = async () => {

        console.log('Sign out click.');

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

    const preLoginNavbarItems = [
        {
            as: Link,
            to: '/',
            title: 'The Latest',
        },
        {
            as: Link,
            to: '/about',
            title: 'About',
        },
        {
            as: Link,
            to: '/contact',
            title: 'Contact',
        },
    ]

    const postLoginNavbarItems = [
        {
            as: Link,
            to: '/',
            navLinkClassName: 'me-5',
            title: 'The Latest',
            iconClassName: 'bi bi-lightning-charge',
            activeIconClassName: 'bi bi-lightning-charge-fill',
            iconMarginEndSize: '1',
        },
        {
            as: Link,
            to: 'dashboard',
            navLinkClassName: 'me-5',
            title: 'Dashboard',
            iconClassName: 'bi bi-grid-1x2',
            activeIconClassName: 'bi bi-grid-1x2-fill',
            iconMarginEndSize: '1',
        },
    ].map(link => ({
        ...link,
        isActive: link.to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(
                link.to.startsWith('/') ? link.to : `/${link.to}`
            )
    }))

    // const dropdownItems = [
    //     {
    //         as: Link,
    //         to: '/dashboard',
    //         onClick: () => console.log('Barev'),
    //         dropdownItemClassName: 'px-2',
    //         itemSpanClassName: 'd-flex justify-content-between',
    //         title: 'Dashboard',
    //         iconClassName: 'bi bi-grid-1x2',
    //     },
    //     {
    //         as: Button,
    //         to: '#',
    //         onClick: () => onSignOutClick(),
    //         dropdownItemClassName: '',
    //         itemSpanClassName: 'd-flex justify-content-between',
    //         title: 'Sign out',
    //         iconClassName: 'bi bi-box-arrow-left',
    //     },
    // ];

    return (
        <Navbar
            expand='lg'
            className='navbar__body'
            sticky={isXs || isSm ? 'top' : ''}
            style={{ zIndex: location.pathname.startsWith('/post') ? '1021' : '0' }}
        >
            <Container>
                <Navbar.Brand href='/' className='me-0 me-lg-4 me-xl-5'>
                    FitClue
                </Navbar.Brand>

                {!isScreenWidthLargerThanMedium &&
                    !location.pathname.startsWith('/search') &&
                    <Form
                        className={`d-flex align-items-center`}
                        style={{ width: isXs ? '55%' : '70%' }}
                        onSubmit={handleSearch}>
                        <SearchForm
                            searchFieldPlacement='SmallScreen'
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            className='navabr__search-bar'
                        />
                    </Form>
                }

                <Navbar.Toggle aria-controls='navbar-nav' className='sdada' onClick={handleShowOffcanvas} />
                <Navbar.Offcanvas id='navbar-nav' placement='end' show={showOffcanvas} onHide={handleCloseOffcanvas} style={{ zIndex: '9000' }}
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
                            FitClue
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body className='pb-0' style={{ height: !isScreenWidthLargerThanMedium ? '100vh' : 'auto' }}
                    >
                        <Nav
                            className='w-100 h-100 flex-grow-1 d-lg-flex align-items-lg-center justify-content-between'
                            style={{
                                maxHeight: '100vh', overflowY: 'auto'
                            }}
                        >
                            <div className='w-100 d-flex flex-column flex-lg-row justify-content-lg-between align-items-lg-center'
                                style={{
                                    minHeight: !isScreenWidthLargerThanMedium ? '180px' : 'auto'
                                }}
                            >
                                {/* Pre-login */}
                                {!isLoggedIn &&
                                    <>
                                        {
                                            preLoginNavbarItems.map((navLink, idx) => {
                                                return (
                                                    <Nav.Link
                                                        key={idx}
                                                        as={navLink.as}
                                                        to={navLink.to}
                                                        className='p-0 mb-3 mb-lg-0'
                                                        onClick={handleCloseOffcanvas}
                                                    >
                                                        {navLink.title}
                                                    </Nav.Link>
                                                )
                                            })
                                        }
                                    </>
                                }

                                {/* Post-login */}
                                {isLoggedIn &&
                                    <>
                                        {
                                            postLoginNavbarItems.map((navLink, idx) => {
                                                return (
                                                    <Nav.Link
                                                        key={idx}
                                                        as={navLink.as}
                                                        to={navLink.to}
                                                        className='p-0 mb-4 mb-lg-0 d-flex align-items-center'
                                                        onClick={handleCloseOffcanvas}
                                                    >
                                                        <Icon
                                                            className={
                                                                `d-flex align-items-center fs-5 ${!navLink.isActive ?
                                                                    navLink.iconClassName :
                                                                    navLink.activeIconClassName}`
                                                            }
                                                            marginEndSize='2'
                                                        />
                                                        {navLink.title}
                                                    </Nav.Link>
                                                )
                                            })
                                        }
                                    </>}

                                {/* Seach */}
                                {isScreenWidthLargerThanMedium &&
                                    !location.pathname.startsWith('/search')
                                    ?
                                    <Form
                                        className={`d-none d-lg-flex align-items-center mb-3 mb-lg-0`}
                                        style={{ width: isScreenWidthLargerThanMedium ? '45%' : '100%' }}
                                        onSubmit={handleSearch}>
                                        <SearchForm
                                            searchFieldPlacement='LargeScreen'
                                            searchTerm={searchTerm}
                                            setSearchTerm={setSearchTerm}
                                        />
                                    </Form>
                                    :
                                    <div style={{ width: isScreenWidthLargerThanMedium ? '45%' : '100%' }} />
                                }

                                {/* Post-login */}
                                {
                                    isLoggedIn &&
                                    <>
                                        <Nav.Link
                                            as={Link}
                                            to='/post/create'
                                            className='p-0 mb-4 mb-lg-0 d-flex justify-content-lg-center align-items-center'
                                        >
                                            <Icon className={`${location.pathname !== '/post/create' ? 'bi bi-plus-square' : 'bi bi-plus-square-fill'} me-2 d-flex justify-content-center align-items-center fs-5`} />
                                            Create
                                        </Nav.Link>

                                        <Nav.Link
                                            as={Button}
                                            onClick={onSignOutClick}
                                            className='d-flex justify-content-center align-items-center'
                                        >
                                            Sign out
                                            <Icon className='bi bi-box-arrow-right ms-2 d-flex justify-content-center align-items-center' />
                                        </Nav.Link>
                                    </>
                                }

                                {/* Sign up/in */}
                                {
                                    !isLoggedIn &&
                                    <>
                                        <Nav.Link
                                            as={Link}
                                            to='/sign-up'
                                            className='navbar__btn sign-up border mb-3 mb-lg-0'
                                        >
                                            Create Free Account
                                        </Nav.Link>
                                        <Nav.Link
                                            as={Link}
                                            to='/sign-in'
                                            className='navbar__btn sign-in border mb-3 mb-lg-0'
                                        >
                                            Sign in
                                        </Nav.Link>
                                    </>
                                }
                            </div>

                        </Nav>

                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    )
}

export default NavigationBar;

{/* <Dropdown drop='start' className='navbar__dropdown' >
                                    <Dropdown.Toggle id='dropdown-profile'>
                                        <Icon className='bi bi-person-circle fs-4 d-flex justify-content-center align-align-items-center' />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {
                                            dropdownItems.map((item, idx) => (
                                                <Dropdown.Item
                                                    key={idx}
                                                    as={item.as}
                                                    to={item.to}
                                                    className={item.dropdownItemClassName}
                                                    onClick={item.onClick}
                                                >
                                                    <span className={item.itemSpanClassName}>
                                                        {item.title}<Icon className={item.iconClassName} />
                                                    </span>
                                                </Dropdown.Item>
                                            ))
                                        }
                                    </Dropdown.Menu>

                                </Dropdown> */}