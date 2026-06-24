import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

export const Quote = () => {
    return (
        <blockquote className='mt-5 mb-0 py-5 accent-bg-color'>
            <Container>
                <Row>
                    <Col as='p' className='fst-italic fs-3 text-center mb-0'>
                        "Discovery is powered by people, not algorithms."
                    </Col>
                </Row>
            </Container>
        </blockquote>
    )
}
