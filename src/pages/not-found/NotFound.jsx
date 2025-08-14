import { Button, Col, Container, Row } from 'react-bootstrap';
import { Icon } from '../../components/Accessories/Icon';
import { BackButton } from '../../components/Navigation/BackButton';
import { Link } from 'react-router-dom';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import { IconLinkOff } from '@tabler/icons-react';
import '../../components/NotFound/NotFound.css';

const NotFound = () => {

    const { isXs, isSm, isMd, isLg, isXl, isXxl } = useBreakpoints();

    return (
        <Container>
            <Row className='min-vh-100'>
                <Col className='d-flex flex-column justify-content-center align-items-center'>
                    <h2>

	<span className='d-flex align-items-center'>
                      <IconLinkOff size={42} className='me-2' />Not Found  
	</span>
  {/*
	     <span className='d-flex align-items-center'>
		<Icon className='bi bi-link-45deg fs-1' />{' '}
		Not Found
	     </span>*/}

                    </h2>
                    <p>
                        Sorry, the page you are looking for does not exist.
                    </p>
                    <p
                        className='d-flex flex-column flex-sm-row justify-content-between not-found__navigation-btns'>
                        
                        <BackButton className='mb-3 mb-sm-0' />

	<Button as={Link} to='/' >
                            The Latest
                        </Button>
                    </p>

                </Col>
            </Row>
        </Container>
    )
}

export default NotFound;