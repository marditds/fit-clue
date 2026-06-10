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
                            Have a question? Browse our{' '}
                            <Link to='/faq'>FAQ page</Link>.
                        </p>

                        <hr />

                        <h4>Contact Us</h4>

                        <p>For the fastest response, please send us a direct message on social:</p>

                        <ul className='list-unstyled d-flex gap-4'>
                            {
                                socials.map((social, idx) => {
                                    return (
                                        <li key={idx}>
                                            <a href={social.link} target='_blank'>
                                                <Icon className={`${social.icon} fs-4`} />
                                            </a>
                                        </li>
                                    )
                                }).slice(0, 2)
                            }
                        </ul>

                        <div className='tip-box mb-3 bg-body-secondary px-3 py-3 border border-start border-bottom-0 border-end-0 border-top-0 border-5'>
                            <strong>Tip:</strong> Please include a detailed description of your issue so we can assist you more efficiently.
                        </div>

                        <p>
                            Don't use social media? Submit via our{' '}
                            <a href='https://docs.google.com/forms/d/e/1FAIpQLSdYYNikc75n1WYBTI_zzWeDB5j_WfGCMV16GEasjtCqjphoeA/viewform' target='_blank' style={{ color: '#666666', textDecoration: 'underline' }} className='fw-bolder'>Contact Form</a>.
                        </p>

                        <p className='fst-italic text-muted'>We typically respond within 1-2 business days.</p>

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