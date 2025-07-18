import { Col, Row, Toast } from 'react-bootstrap';

export const ToastComponent = ({ showToast, setShowToast, toastTitle, toastText }) => {

    setTimeout(() => setShowToast(false), 3000);

    return (
        <Row className='fixed-top mx-auto justify-content-center'
            style={{
                maxWidth: '1320px'
            }}
        >
            <Col
                xs={12}
                md={5}
                lg={4}
            >
            </Col>
            <Col
                className='my-5 w-100 d-flex justify-content-center'
            >
                <Toast show={showToast} onClose={() => setShowToast(false)}>
                    <Toast.Header>
                        <strong className='me-auto'>
                            {toastTitle}
                        </strong>
                    </Toast.Header>
                    {/* <Toast.Body>
                        {toastText}
                    </Toast.Body> */}
                </Toast>
            </Col>
        </Row>
    );
} 