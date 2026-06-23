import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

export const Quote = () => {
    return (
        <section className='mt-4 py-5 accent-bg-color'>
            <Container>
                <Row>
                    <Col className='fst-italic fs-3 text-center'>
                        "Discovery is powered by people, not algorithms."
                    </Col>
                </Row>
            </Container>
        </section>
    )
}
