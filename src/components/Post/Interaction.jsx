import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';

const interactionButtons = [
    {
        name: 'Share',
        func: () => { console.log(`Name is clicked.`); },
    },
    {
        name: 'Save',
        func: () => { console.log(`Save is clicked.`); },
    },
    {
        name: 'Report',
        func: () => { console.log(`Report is clicked.`); },
    },
]

export const Interaction = () => {
    return (
        <div>
            <Row>
                <Col>
                    {
                        interactionButtons.map((button, idx) => {
                            return (
                                <Button key={idx} onClick={button.func}>
                                    {button.name}
                                </Button>
                            )
                        })
                    }
                </Col>
            </Row>
        </div>
    )
}
