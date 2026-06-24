import { IconHexagon4 } from '@tabler/icons-react';
import React from 'react'
import { Col, Container, Row } from 'react-bootstrap';

export const Hero = () => {
    return (
        <Container as='section' className='my-5'>
            <Row>
                <Col>
                    <header>
                        <h1 className='text-center'>
                            About FitClue
                        </h1>
                        <p className='text-muted text-center'>
                            <em>
                                "Fashion is everywhere. Let's discover it together."
                            </em>
                        </p>
                    </header>
                </Col>
            </Row>
        </Container>
    )
}
