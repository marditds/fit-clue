import { Container, Row, Col } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import { Icon } from '../Accessories/Icon';
import { FooterLayout } from './FooterLayout';
import { socials } from '../../lib/data/socials';

const Footer = () => {

    const location = useLocation();

    const { isXs, isSm } = useBreakpoints();

    const authPages = ['/sign-up', '/sign-in', '/forgot-password', '/forgot-password'];

    const footerLinks = [
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
            decoration: <Icon className='bi bi-dot' />
        },
        {
            title: 'FAQ',
            link: '/faq',
            decoration: <Icon className='bi bi-dot' />
        },
        {
            title: 'Support',
            link: '/support',
            decoration: <Icon className='bi bi-dot' />
        }
    ]

    const copyright = <>© {new Date().getFullYear()} FitClue. All rights reserved.</>

    return (
        <FooterLayout>
            <Row className='align-items-center'>

                {!authPages.includes(location.pathname) &&
                    <Col
                        className='w-100 d-flex flex-md-row flex-column align-items-center justify-content-between'>

                        <Link to='/' className='text-decoration-none mb-1 mb-md-0' style={{ fontSize: '1.25rem' }}>
                            FitClue
                        </Link>


                        <div>
                            {socials.map((item, idx) => (
                                <span key={idx}>
                                    <a href={item.link} target='_blank'>
                                        <Icon className={`${item.icon} ms-md-4 ms-3 me-md-0 me-3 fs-5`} />
                                    </a>
                                </span>
                            ))
                            }
                        </div>
                    </Col>
                }

                {!authPages.includes(location.pathname) &&
                    <hr className='my-md-3 my-2' />
                }

                <Col className='d-flex flex-column flex-md-row align-items-center justify-content-md-between'
                    style={{ marginBottom: isXs && location.pathname.startsWith('/dashboard') ? '51.39px' : '0px' }}
                >
                    {footerLinks.map((item, idx) => (
                        <Link to={item.link} key={idx} className='text-decoration-none my-md-0 my-1'>
                            {item.title}
                        </Link>
                    ))
                    }
                    <div className='text-muted my-md-0 my-1'>
                        {copyright}
                    </div>
                </Col>

            </Row>
        </FooterLayout>
    )

};

export default Footer;