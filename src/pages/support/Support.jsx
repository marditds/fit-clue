import { Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useBreakpoints } from '../../lib/hooks/useBreakpoints'
import support from '../../assets/support.jpg'
import { socials } from '../../lib/data/socials'
import { Icon } from '../../components/Accessories/Icon'

const Support = () => {

    const { isXs, isSm } = useBreakpoints();

    return (
        <Container className='min-vh-100 d-flex justify-content-center align-items-center'>
            <Row className='form__row w-100'>

                <Col
                    style={{
                        backgroundImage: (isXs || isSm) ? `url(${support})` : '',
                        height: '650px'
                    }}
                    className={`form__col 
                        form__col-background-overlay
                         d-flex justify-content-center align-items-center w-100 `}
                >
                    <div style={{ zIndex: '2', maxWidth: '450px' }}>
                        <h2 className='mb-3 text-left'>Support</h2>

                        <p className='mb-3'>
                            Need help? You may find an answer on our{' '}
                            <Link to='/faq'>FAQ page</Link>.
                        </p>

                        <h4>Contact us</h4>

                        <p>For the fastest response, please send us a direct message on either platform:</p>

                        <ul className='list-unstyled'>
                            {
                                socials.map((social, idx) => {
                                    return (
                                        <li>
                                            <a href={social.link} target='_blank'>
                                                <Icon className={social.icon} />
                                            </a>
                                        </li>
                                    )
                                })
                            }
                        </ul>

                        <p>
                            Don't use social media? You can submit an inquiry or data privacy request via our{' '}
                            <a href="YOUR_GOOGLE_FORM_LINK" style={{ color: '#666666', textDecoration: 'underline' }}>Contact Form</a>.
                        </p>

                        <div className='tip-box mb-3 bg-body-secondary px-2 py-1'>
                            <strong>How to get faster help:</strong> Please include a brief description of your issue and any relevant screenshots so we can assist you more efficiently.
                        </div>

                        <p className='fst-italic text-muted'>We typically respond within 24-48 hours.</p>

                    </div>
                </Col>
                <Col
                    xs={5}
                    className={`${(isXs || isSm) ? 'd-none' : 'form__col-signup-img'}`}
                    style={{
                        backgroundImage: (isXs || isSm) ? '' : `url(${support})`,
                        height: '650px'
                    }}
                ></Col>

            </Row>
        </Container>
    )
}

export default Support