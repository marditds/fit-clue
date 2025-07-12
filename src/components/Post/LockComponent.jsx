import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const LockComponent = ({ divClassName, rowClassName, colClassName, titleClassName, paragraphClassName, btnClassName, btnText, path, lockTitle, lockText }) => {
    return (
        <div className={divClassName || ''}>
            <Row className={rowClassName || ''}>
                <Col className={colClassName || ''}>
                    <h3 className={titleClassName || ''}>{lockTitle || ''}</h3>
                    <p className={paragraphClassName || ''}>
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