import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Container, Image, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { useUserContext } from '../../lib/context/UserContext';
import { useUser } from '../../lib/hooks/useUser';
import { footerLinks, copyright } from '../../lib/data/footerData';
import { SearchComponent } from '../Form/SearchForm';
import './Navigation.css';
import { Icon } from '../Accessories/Icon';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import { IconMenu2 } from '@tabler/icons-react';
import { PlainModal } from '../Modals/Modals';
import { Socials } from '../Socials/Socials';

const NavigationBar = () => {

    const navigate = useNavigate();

    const location = useLocation();

    const {
        isLoggedIn
    } = useUserContext();

    const { onSignOutClick } = useUser();

    const { isXs, isSm, isMd, isLg } = useBreakpoints();

    const [searchTerm, setSearchTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState('personality');
    // const [showCategories, setShowCategories] = useState(false);

    const [showSearchModal, setShowSearchModal] = useState(false);

    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const isScreenWidthLargerThanMedium = !isXs && !isSm && !isMd;

    useEffect(() => {
        setShowOffcanvas(false);
    }, [location.pathname]);

    useEffect(() => {
        if (isScreenWidthLargerThanMedium) {
            setShowOffcanvas(false);
        }
    }, [isScreenWidthLargerThanMedium])

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
        if (searchCategory.trim() && searchTerm.trim()) {
            navigate(`/search/${encodeURIComponent(searchCategory)}/${encodeURIComponent(searchTerm)}`);
        }
    };

    useEffect(() => {
        setShowSearchModal(false);
    }, [location.pathname])

    const preLoginNavbarItems = [
        {
            as: Link,
            to: '/',
            title: 'Home',
            className: ''
        },
        {
            as: Link,
            to: '/about',
            title: 'About',
            className: 'd-none'
        },
        {
            as: Link,
            to: '/faq',
            title: 'FAQ',
            className: ''
        }
    ]

    const postLoginNavbarItems = [
        {
            as: Link,
            to: '/',
            navLinkClassName: 'me-5',
            title: 'Home',
            iconClassName: 'bi bi-house',
            activeIconClassName: 'bi bi-house-fill',
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

    const userNavigationItems = [
        {
            as: Link,
            to: '/post/create',
            title: 'Create',
            iconClassName: 'bi bi-plus-square',
            // iconClassName: 'bi bi-file-earmark-plus fs-5',
            activeIconClassName: 'bi bi-plus-square-fill',
            // activeIconClassName: 'bi bi-file-earmark-plus-fill fs-5',
            iconMarginEndSize: '2',
            onClick: () => console.log('create'),
        },
        {
            as: Link,
            to: '/dashboard',
            title: 'Dashboard',
            iconClassName: 'bi bi-grid-1x2',
            activeIconClassName: 'bi bi-grid-1x2-fill',
            iconMarginEndSize: '2',
            onClick: () => console.log('dashboard'),

        },
        {
            as: Button,
            to: '#',
            title: 'Sign out',
            iconClassName: 'bi bi-box-arrow-right',
            activeIconClassName: 'bi bi-box-arrow-right',
            iconMarginEndSize: '2',
            onClick: onSignOutClick,
        },
    ].map(link => ({
        ...link,
        isActive: location.pathname.startsWith(link.to)
    }))


    return (
        <Navbar
            expand='lg'
            className='navbar__body border border-1 border-top-0'
            sticky={isXs || isSm ? 'top' : ''}
            style={{ zIndex: location.pathname.startsWith('/post') ? '1021' : '5' }}
        >
            <Container>
                <Navbar.Brand href='/' className='me-0 me-lg-4 me-xl-5 d-flex'>
                    <Image src='/src/assets/fcLogoNavbar.png' style={{ maxHeight: '20px' }} className='my-2' fluid />
                    {/* FitClue */}
                </Navbar.Brand>

                {!isScreenWidthLargerThanMedium &&
                    !location.pathname.startsWith('/search') &&
                    <Button
                        onClick={() => setShowSearchModal(true)}
                        className='text-start bg-light border'
                        style={{ width: isScreenWidthLargerThanMedium ? '0px' : '65%' }}
                    >
                        <Icon className='bi bi-search' marginEndSize='2' />
                        Search FitClue...
                    </Button>
                }

                <Navbar.Toggle aria-controls='navbar-nav' className='sdada' onClick={handleShowOffcanvas}>
                    <IconMenu2 size={21} />
                </Navbar.Toggle>
                <Navbar.Offcanvas id='navbar-nav' placement='end' show={showOffcanvas} onHide={handleCloseOffcanvas} style={{ zIndex: '9000' }}
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
                            <Link to='/'>
                                <Image src='/src/assets/fcLogoNavbar.png' style={{
                                    // width: '100%',
                                    maxHeight: '20px'
                                }} fluid
                                />
                            </Link>

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
                                                        className={`p-0 mb-3 mb-lg-0 
                                                            ${isLg ? navLink.className : ''}
                                                        `}
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
                                                        className='mb-4 mb-lg-0 d-flex align-items-center px-2 py-1'
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
                                    <Button
                                        onClick={() => setShowSearchModal(true)}
                                        className='text-start bg-light border'
                                        style={{ width: isScreenWidthLargerThanMedium ? '45%' : '100%' }}
                                    >
                                        <Icon className='bi bi-search' marginEndSize='2' />
                                        Search FitClue...
                                    </Button>
                                    :
                                    <div style={{ width: isScreenWidthLargerThanMedium ? '45%' : '100%' }} />
                                }

                                {/* Post-login user items */}
                                {
                                    isLoggedIn &&
                                    userNavigationItems.map((item, idx) => (
                                        <Nav.Link
                                            key={idx}
                                            as={item.as}
                                            to={item.to}
                                            className='d-flex justify-content-lg-center align-items-center mb-4 mb-lg-0 px-2 py-1'
                                            onClick={item.onClick}
                                        >
                                            <Icon className={!item.isActive ? item.iconClassName : item.activeIconClassName} marginEndSize={item.iconMarginEndSize} />
                                            {item.title}
                                        </Nav.Link>
                                    ))
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

                            {/* Offcanva footer */}
                            {!isScreenWidthLargerThanMedium &&
                                <div>
                                    <hr className='' />
                                    <div className='d-flex'>
                                        <Socials className='fs-5 d-flex mb-3 me-4' />
                                    </div>
                                    <ul className='list-unstyled d-flex flex-wrap mb-3'>
                                        {
                                            footerLinks.map((link, idx) => (
                                                <li key={idx} className=''>
                                                    <Link to={link.link} className='text-decoration-none'>
                                                        {link.title}
                                                    </Link>
                                                    <Icon className={link.decoration} />
                                                </li>
                                            ))
                                        }
                                    </ul>
                                    <div className='mb-3'>
                                        {copyright}
                                    </div>
                                </div>}

                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>

                {/* Search modal */}
                <PlainModal
                    showModal={showSearchModal}
                    modalTitle='Search FitClue'
                    headerClassName='border-bottom-0'
                    handleFunction={() => setShowSearchModal(false)}
                >
                    <SearchComponent
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        onSubmit={handleSearch}
                        setSearchCategory={setSearchCategory}
                        searchCategory={searchCategory}
                    />
                </PlainModal>

            </Container>
        </Navbar>
    )
}

export default NavigationBar;