import { Col, Container, Row } from 'react-bootstrap';
import { Icon } from '../../components/Accessories/Icon';
import { BackButton } from '../../components/Navigation/BackButton';

export const NotFound = () => {
    return (
        <Container>
            <Row className='min-vh-100'>
                <Col className='d-flex flex-column justify-content-center align-items-center'>
                    <h2>
                        <Icon className='bi bi-link-45deg' /> Not Found
                    </h2>
                    <p>
                        Sdsdorry, the page you are looking for does not exist.
                    </p>
                    <BackButton />
                </Col>
            </Row>
        </Container>
    )
}
