import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import { Link, useLocation } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { Icon } from '../Accessories/Icon';
import './Sidebar.css';

export const Sidebar = ({ username }) => {

    const location = useLocation();

    const { isXs, isSm, isMd } = useBreakpoints();

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

    return (
        <Col
            xs={12}
            md={5}
            lg={4}
            className='border'
            style={{
                minHeight: !isXs && !isSm && !isMd ? 'calc(100vh - 112px)' : 'fit-content',
            }}
        >
            <Row className='sticky-top px-4 px-lg-4 pt-lg-5 flex-column'>
                <Col className='text-center'>
                    <h2>{username}</h2>
                </Col>
                <Col className=''>
                    <ul className='list-unstyled'>
                        {links.map((link, idx) => (
                            <li key={idx}
                                className='px-0 px-xl-3 py-3'
                            >
                                <Link
                                    to={link.to}
                                    className={`d-flex align-items-center text-decoration-none px-2 py-1 sidebar__link ${link.isActive ? 'fw-bold' : ''}`}
                                    style={{
                                        borderRadius: 'var(--main-border-radius)',
                                        backgroundColor: link.isActive ? 'var(--main-accent-color)' : 'transparent'
                                    }}
                                >
                                    <Icon className={`${link.icon} me-3 fs-4`} />
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Col>
            </Row>
        </Col>
    );
};