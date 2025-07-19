import { Link, useLocation } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { Icon } from '../Accessories/Icon';
import './Sidebar.css';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';

export const Sidebar = ({ username }) => {

    const location = useLocation();

    const { isXs, isSm } = useBreakpoints();

    const links = [
        {
            label: 'Account Settings',
            icon: 'bi bi-gear',
            to: 'settings',
        },
        {
            label: 'Saved Posts',
            icon: 'bi bi-floppy',
            to: 'saved-posts',
        },
        {
            label: 'Help Center',
            icon: 'bi bi-question-square',
            to: 'help-center',
        },
        {
            label: 'Privacy Policy',
            icon: 'bi bi-shield',
            to: 'privacy-policy',
        },
        {
            label: 'Terms of Use',
            icon: 'bi bi-file-earmark-text',
            to: 'terms-of-use',
        },
    ].map(link => ({
        ...link,
        isActive: location.pathname.startsWith(`/dashboard/${link.to}`)
    }));

    const isScreenSmall = isXs || isSm;

    return (
        <Row className='sticky-top px-4 px-lg-4 pt-lg-5 flex-column'>
            <Col className='text-center'>
                <h2>{username}</h2>
            </Col>
            <Col className={isScreenSmall ? 'px-0' : ''}>
                <div className={isScreenSmall ? 'fixed-bottom mt-5' : ''}>
                    <ul className={`list-unstyled d-flex justify-content-evenly flex-md-column ${isScreenSmall ? 'bg-light mb-0' : ''}`}>
                        {links.map((link, idx) => (
                            <li key={idx}
                                className='px-0 px-xl-3 py-2 py-md-3'
                            >
                                <Link
                                    to={link.to}
                                    className={`d-flex-column d-md-flex align-items-center text-decoration-none px-2 py-2 px-md-2 py-md-1 sidebar__link ${link.isActive ? 'fw-bold' : ''}`}
                                    style={{
                                        borderRadius: 'var(--main-border-radius)',
                                        backgroundColor: link.isActive ? 'var(--main-accent-color)' : 'transparent'
                                    }}
                                >
                                    <Icon
                                        className={`${link.icon} fs-4`}
                                        marginSize={isScreenSmall ? '0' : '3'}
                                    />
                                    <div className='d-none d-md-block'>
                                        {link.label}
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </Col>
        </Row>
    );
};