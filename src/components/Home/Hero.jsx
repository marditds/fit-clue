import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Icon } from '../Accessories/Icon'

export const Hero = () => {
    return (
        <section className='py-3 py-md-5 secondary-bg-color'>
            <Container>
                <Row>
                    <Col className='text-start'>
                        <h2>
                            Spotted something you love? Find out what it is.
                        </h2>
                        <p className='mt-3 mb-2'>
                            FitClue is a community for fashion lovers.

                            We help each other identify brands, items, and where to buy them.

                            No algorithms, just people who know style.

                        </p>
                        <Link to='/about' className='d-flex align-items-center justify-content-start'>Learn more about FitClue <Icon className={'bi bi-chevron-right ms-1 fs-4'} />
                        </Link>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}
