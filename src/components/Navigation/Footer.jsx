import { Container, Row, Col } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import { Icon } from '../Accessories/Icon';
import { FooterLayout } from './FooterLayout';

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
            decoration: ''
        },
        // {
        //     title: 'FAQ',
        //     link: '/faq',
        //     decoration: ''
        // }
    ]

    const footerSocials = [
        {
            icon: 'bi bi-instagram',
            link: 'https://www.instagram.com/'
        },
        {
            icon: 'bi bi-twitter-x',
            link: 'https://www.x.com/'
        },
        {
            icon: 'bi bi-facebook',
            link: 'https://www.facebook.com/'
        },
    ]

    const copyright = <>© {new Date().getFullYear()} FitClue. All rights reserved</>

    // if (authPages.includes(location.pathname)) {
    return (
        <FooterLayout>
            <Row className='align-items-center'>
                <Col xs={12} lg={10} className='mb-0 d-flex flex-column flex-md-row align-items-center'>
                    {!isXs && !isSm && <>
                        {copyright} <Icon className='ms-2 bi bi-dot' />
                    </>}
                    {
                        footerLinks.map((item, idx) => (
                            <span key={idx} className='mb-2 mb-md-0 d-flex align-items-center'>
                                <Link to={item.link} className='mx-2 text-decoration-none'>
                                    {item.title}
                                </Link>
                                {
                                    (!isXs && !isSm) &&
                                    item.decoration
                                }
                            </span>
                        ))
                    }
                </Col>
                <hr className='mb-2 mt-0 my-md-3 d-block d-lg-none' />

                {!authPages.includes(location.pathname) &&
                    <>
                        <Col xs={5} sm={3} lg={2} className='ms-auto me-auto me-md-0 ms-md-auto d-flex justify-content-between'>
                            {
                                footerSocials.map((item, idx) => (
                                    <span key={idx}>
                                        <a href={item.link} target='_blank'>
                                            <Icon className={`${item.icon} fs-5`} />
                                        </a>
                                    </span>
                                ))
                            }
                        </Col>
                        <hr className='my-2 mt-md-3 d-block d-md-none' />
                    </>
                }

                <Col className='d-block d-md-none text-center'>
                    {(isXs || isSm) && copyright}
                </Col>
            </Row>
        </FooterLayout>
    )
    // }

    // return (
    //     <FooterLayout>
    //         <Row className='justify-content-center align-items-center'>
    //             <Col xs={12} lg={10} className='mb-2 mb-md-0 d-flex flex-column flex-md-row align-items-center'>
    //                 {!isXs && !isSm && <>
    //                     {copyright} <Icon className='ms-2 bi bi-dot' />
    //                 </>}
    //                 {
    //                     footerLinks.map((item, idx) => (
    //                         <span key={idx}>
    //                             <Link to={item.link} className='mx-2 text-decoration-none'>
    //                                 {item.title}
    //                             </Link>
    //                             {
    //                                 (!isXs && !isSm) &&
    //                                 item.decoration
    //                             }
    //                         </span>
    //                     ))
    //                 }
    //                 {(isXs || isSm) && copyright}
    //             </Col>
    //             <Col xs={12} lg={2} className='d-flex justify-content-between'>
    //                 {
    //                     footerSocials.map((item, idx) => (
    //                         <span key={idx}>
    //                             <a href={item.link} target='_blank'>
    //                                 <Icon className={`${item.icon} fs-5`} />
    //                             </a>
    //                         </span>
    //                     ))
    //                 }
    //             </Col> 
    //         </Row> 
    //     </FooterLayout>
    // );
};

export default Footer;