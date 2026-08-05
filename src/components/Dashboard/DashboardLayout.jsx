import { Col, Container, Row } from 'react-bootstrap'

export const DashboardLayout = ({ topRowContent, rowClassName, rowStyle, colOneClassName, colOneStyle, colOneContent, colTwoClassName, colTwoStyle, children, scrollTop }) => {
    return (
        <Container>
            <Row className='d-md-none secondary-bg-color'>
                <Col className='d-flex justify-content-between py-2'>
                    {topRowContent}
                </Col>
            </Row>
            <Row className={rowClassName} style={rowStyle}>
                <Col
                    xs={12}
                    sm={2}
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
