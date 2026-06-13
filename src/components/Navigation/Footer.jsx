import { Container, Row, Col, Image } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import { footerLinks, copyright } from '../../lib/data/footerData';
import { Icon } from '../Accessories/Icon';
import { FooterLayout } from './FooterLayout';
import { Socials } from '../Socials/Socials';

const Footer = () => {

    const location = useLocation();

    const { isXs, isSm } = useBreakpoints();

    const authPages = ['/sign-up', '/sign-in', '/forgot-password', '/forgot-password'];

    return (
        <FooterLayout>
            <Row className='align-items-center'>

                {!authPages.includes(location.pathname) &&
                    <Col
                        className='w-100 d-flex flex-column flex-md-row align-items-center justify-content-between'>

                        <Link to='/' className='text-decoration-none' style={{ fontSize: '1.25rem' }}>
                            <Image src='/src/assets/fcLogoNavbar.png' style={{ maxHeight: '25px' }} className='d-flex align-items-center my-2 my-md-0' fluid />
                        </Link>

                        <div className='d-flex'>
                            <Socials className='ms-md-4 me-md-0 mx-3 fs-5 d-flex my-2' />
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