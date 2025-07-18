import { Col, Container, Row } from 'react-bootstrap'

export const LayoutDashboard = ({ rowClassName, rowStyle, colOneClassName, colOneStyle, colOneContent, colTwoClassName, children, scrollTop }) => {
    return (
        <Container>
            <Row className={rowClassName} style={rowStyle}>
                <Col
                    xs={12}
                    md={5}
                    lg={4}
                    className={colOneClassName}
                    style={colOneStyle}
                >
                    {colOneContent}
                </Col>
                <Col className={colTwoClassName}>
                    {children}
                </Col>
            </Row>
            {scrollTop}
        </Container>
    )
}
