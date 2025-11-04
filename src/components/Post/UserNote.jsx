import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { Icon } from '../Accessories/Icon'

export const UserNote = ({ userNote }) => {
    return (
        <div>
            <Row className='mx-auto w-100'>
                <Col className='py-4'>
                    <h3>
                        <Icon
                            className='bi bi-file-earmark-text'
                            marginEndSize={'2'}
                        />User's Note
                    </h3>
                    <p className='mb-0'>
                        {userNote}
                        I would like to know the brand of the shoes in the third slide. Thanks. 😊🙏
                    </p>
                </Col>
            </Row>
        </div>
    )
}
