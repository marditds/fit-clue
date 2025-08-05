import { Col, Container, Row } from 'react-bootstrap'

export const LegalTemplate = ({ title, content }) => {
    return (
        <Container>
            <Row>
                <Col>
                    <h2>
                        {title}
                    </h2>
                </Col>
            </Row>
            <Row className='flex-column'>
                {content}
            </Row>
        </Container>
    )
}
