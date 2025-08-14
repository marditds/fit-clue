import { Button, Col, Container, Row } from 'react-bootstrap';
import { Icon } from '../../components/Accessories/Icon';
import { BackButton } from '../../components/Navigation/BackButton';
import { Link } from 'react-router-dom';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import '../../components/NotFound/NotFound.css';

export const NotFound = () => {

    const { isXs, isSm, isMd, isLg, isXl, isXxl } = useBreakpoints();

    return (
        <Container>
            <Row className='min-vh-100'>
                <Col className='d-flex flex-column justify-content-center align-items-center'>
                    <h2>
                        <Icon className='bi bi-link-45deg' /> Not Found
                    </h2>
                    <p>
                        Sorry, the page you are looking for does not exist.
                    </p>
                    <p
                        className='d-flex flex-column flex-sm-row justify-content-between not-found__navigation-btns'>
                        <Button as={Link} to='/' className='mb-3 mb-sm-0'>
                            The Latest
                        </Button>
                        <BackButton />

                    </p>

                </Col>
            </Row>
        </Container>
    )
}
