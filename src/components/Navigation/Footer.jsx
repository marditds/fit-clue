import { Container, Row, Col } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import { Icon } from '../Accessories/Icon';
import { FooterLayout } from './FooterLayout';

const Footer = () => {

    const location = useLocation();

    const { isXs, isSm } = useBreakpoints();

    const authPages = ['/sign-up', '/sign-in', '/forgot-password', '/forgot-password'];

    const footerItems = [
        {
            title: 'Terms of Service',
            link: '/tos',
            decoration: <Icon className='bi bi-dot' />
        },
        {
            title: 'Privacy Policy',
            link: '/privacy',
            decoration: <Icon className='bi bi-dot' />
        },
        {
            title: 'Community Guidelines',
            link: '/community-guidelines',
            decoration: ''
        }
    ]

    const copyright = <>© {new Date().getFullYear()} FitClue. All rights reserved</>

    if (authPages.includes(location.pathname)) {
        return (
            <FooterLayout>
                <Row className='align-items-center'>
                    <Col className='mb-md-0 d-flex flex-column flex-md-row text-center'>
                        {!isXs && !isSm && <>
                            {copyright} <Icon className='ms-2 bi bi-dot' />
                        </>}
                        {footerItems.map((item, idx) => (
                            <Link
                                key={idx}
                                to={item.link}
                                className='text-decoration-none mb-2 mb-md-0'
                            >
                                <span className='mx-2'>
                                    {item.title}
                                </span>
                                {
                                    (!isXs && !isSm) &&
                                    item.decoration
                                }
                            </Link>
                        ))}
                        {(isXs || isSm) && copyright}
                    </Col>
                </Row>
            </FooterLayout>
        )
    }

    return (
        <FooterLayout>
            <Row xs={1} md={3} className='justify-content-center align-items-center mb-0 mb-md-3'>
                {
                    footerItems.map((item, idx) => (
                        <Col key={idx} className='text-center mb-2 mb-md-0'>
                            <Link to={item.link} className='mx-2 text-decoration-none'>
                                {item.title}
                            </Link>
                        </Col>
                    ))
                }
            </Row>
            <Row>
                <Col className='text-center mb-2 mb-md-0'>
                    {copyright}.
                </Col>
            </Row>
        </FooterLayout>
    );
};

export default Footer;