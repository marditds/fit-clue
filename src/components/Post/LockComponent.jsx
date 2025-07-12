import { Button, Col, Row } from 'react-bootstrap';
import { authText } from '../../config/formText';
import { Link } from 'react-router-dom';

export const LockComponent = ({ divClassName, rowClassName, colClassName, btnClassName, btnText, path, lockTitle, lockText }) => {
    return (
        <div className={divClassName || ''}>
            <Row className={rowClassName || ''}>
                <Col className={colClassName || ''}>
                    <h3>{lockTitle || ''}</h3>
                    <p>
                        {lockText}
                    </p>
                    <Button
                        as={Link}
                        to={path}
                        className={btnClassName || ''}
                    >
                        {btnText}
                    </Button>
                </Col>
            </Row>
        </div>
    )
} 