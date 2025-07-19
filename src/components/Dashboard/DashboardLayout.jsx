import { Col, Container, Row } from 'react-bootstrap'

export const DashboardLayout = ({ rowClassName, rowStyle, colOneClassName, colOneStyle, colOneContent, colTwoClassName, colTwoStyle, children, scrollTop }) => {
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
                <Col className={colTwoClassName} style={colTwoStyle}>
                    {children}
                </Col>
            </Row>
            {scrollTop}
        </Container>
    )
}
