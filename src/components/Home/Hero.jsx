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
Love an outfit on Instagram?
Find the exact item or something beautifully similar.
</h2>
 <p className='mt-3 mb-2'> 
FitClue is a community for fashion lovers.
</p>
 <p className='mt-3 mb-2'> 
No algorithms. Just people who know style.
</p>
<p className='mt-3 mb-2'>
Together we're building a searchable collection of Instagram fashion.
</p> 
                        <Link to='/about' className='d-flex align-items-center justify-content-start'>Learn more about FitClue <Icon className={'bi bi-chevron-right ms-1 fs-4'} />
                        </Link>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}
