import { Link, useLocation } from 'react-router-dom';
import { Button, Col, Row } from 'react-bootstrap';
import { Icon } from '../Accessories/Icon';
import './Sidebar.css';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import { useUser } from '../../lib/hooks/useUser';

export const Sidebar = ({ username }) => {

    const location = useLocation();

    const { onSignOutClick } = useUser();

    const { isXs, isSm } = useBreakpoints();

    const links = [
        {
            label: 'Account Settings',
            icon: 'bi bi-gear',
            activeIcon: 'bi bi-gear-fill',
            to: 'settings',
        },
        {
            label: 'Saved Posts',
            icon: 'bi bi-floppy',
            activeIcon: 'bi bi-floppy-fill',
            to: 'saved-posts',
        },
        // {
        //     label: 'Help Center',
        //     icon: 'bi bi-info-square',
        //     activeIcon: 'bi bi-info-square-fill',
        //     to: 'help-center',
        // },
        {
            label: 'FAQ',
            icon: 'bi bi-question-square',
            activeIcon: 'bi bi-question-square-fill',
            to: 'faq',
        },
        {
            label: 'Privacy Policy',
            icon: 'bi bi-shield',
            activeIcon: 'bi bi-shield-fill',
            to: 'privacy',
        },
        {
            label: 'Terms of Use',
            icon: 'bi bi-file-earmark-text',
            activeIcon: 'bi bi-file-earmark-text-fill',
            to: 'tos',
        },
    ].map(link => ({
        ...link,
        isActive: location.pathname.startsWith(`/dashboard/${link.to}`)
    }));

    const isScreenExtraSmall = isXs;
    const isScreenSmall = isSm;

    return (
        <Row
            className='sticky-top px-2 px-lg-4 pt-md-5 flex-column'>
            <Col className='text-center d-none d-md-block'>
                <h2 className='mt-0 mt-sm-2'>{username}</h2>
            </Col>
            <Col>
                <div className={isScreenExtraSmall ? 'fixed-bottom mt-5' : ''}>
                    <ul className={`list-unstyled 
                        d-flex justify-content-evenly 
                        flex-sm-column ${isScreenExtraSmall ? 'bg-light mb-0' : ''}`}
                        style={{
                            paddingTop: isSm ? '56px' : '0px'
                        }}
                    >
                        {links.map((link, idx) => (
                            <li key={idx} className='px-0 px-xl-3 py-2 py-md-3'>
                                <Link
                                    to={link.to}
                                    className={`d-flex-column d-md-flex  align-items-center text-decoration-none p-2 py-md-2 px-md-3 sidebar__link ${link.isActive ? 'fw-bold' : ''}`}
                                    style={{
                                        borderRadius: 'var(--main-border-radius)',
                                        backgroundColor: link.isActive && (!isScreenExtraSmall && !isScreenSmall) ? 'var(--main-accent-color)' : 'transparent'
                                    }}
                                >
                                    <Icon
                                        className={`
                                            ${!link.isActive ? link.icon : link.activeIcon} 
                                            ${isScreenSmall ? 'd-flex justify-content-center align-items-center' : ''} 
                                            ${isScreenExtraSmall ? 'my-auto' : ''} 
                                        fs-4`}
                                        marginEndSize={isScreenExtraSmall || isScreenSmall ? '0' : '3'}
                                    />
                                    <div className='d-none d-md-block'>
                                        {link.label}
                                    </div>
                                </Link>
                            </li>
                        ))}

                        <li className='px-0 px-xl-3 py-0 d-flex justify-content-center align-items-center d-none d-sm-flex'
                            style={{
                                height: isXs ? 'auto' : '80.39px'
                            }}
                        >
                            <Button
                                onClick={onSignOutClick}
                                className='d-flex-column d-md-flex  align-items-center text-decoration-none p-2 py-md-2 px-md-3 sidebar__link w-100 bg-transparent'
                            >
                                <Icon
                                    className={`bi bi-box-arrow-right 
                                            ${isScreenSmall ? 'd-flex justify-content-center align-items-center' : ''} 
                                            ${isScreenExtraSmall ? 'my-auto' : ''} 
                                        fs-4`}
                                    marginEndSize={isScreenExtraSmall || isScreenSmall ? '0' : '3'}
                                />
                                <div className='d-none d-md-block'>
                                    Sign Out
                                </div>
                            </Button>
                        </li>
                    </ul>
                </div>
            </Col>
        </Row>
    );
};