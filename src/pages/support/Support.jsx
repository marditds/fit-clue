import { Col, Container, Row } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { useBreakpoints } from '../../lib/hooks/useBreakpoints'
import support from '../../assets/support.jpg'

const Support = () => {

    const location = useLocation();
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
                        <h2 className='mb-3 text-center'>Support</h2>

                        <p className='mb-3'>
                            Need help? You may find an answer on our{' '}
                            <Link to='/faq'>FAQ</Link> page.
                        </p>

                        <div className='mb-3'>
                            <p className='mb-1 fw-semibold'>Contact us</p>
                            <p className='mb-0'>
                                📧{' '}
                                <a href='mailto:email@emails.com' className='text-decoration-none'>
                                    email@emails.com
                                </a>
                            </p>
                        </div>

                        <p className='mb-3'>
                            Please include a brief description of your issue and any relevant
                            screenshots so we can assist you more efficiently.
                        </p>

                        <p className='mb-0 small'>
                            We typically respond within 24–48 hours.
                        </p>

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
        // <Container className='py-4'>
        //     <Row className='justify-content-center'>
        //         <Col md={8} lg={6}>



        //         </Col>
        //     </Row>
        // </Container>
    )
}

export default Support