import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import './Form.css';
import { Link, useLocation } from 'react-router-dom';

export const PasswordForm = ({
    isXs,
    isSm,
    imgSrc,
    leftColClassName,
    headerTitle,
    headerSubtitle,
    children,
    buttonText,
    onSubmit,
    isLoading,
    successMsg,
    errorMsg,
    expiredLinkBlock,
    buttonDisabled,
    extraLinks
}) => {

    const location = useLocation();
    const showSignInLink = location.pathname === '/reset-password';

    return (
        <Container className='min-vh-100 d-flex justify-content-center align-items-center'>
            <Row className='form__row w-100'>
                <Col xs={5} className={`${leftColClassName} ${(isXs || isSm) && 'd-none'}`}></Col>
                <Col
                    style={{
                        backgroundImage: (isXs || isSm) ? `url(${imgSrc})` : ''
                    }}
                    className='form__col form__col-background-overlay d-flex justify-content-center align-items-center w-100'>
                    <Form className={isXs ? 'w-100' : 'w-75'}>
                        <div className='text-center mb-4'>
                            <h3 className='mb-2'>{headerTitle}</h3>
                            <p className='text-muted'>{headerSubtitle}</p>
                        </div>

                        {children}

                        <Button
                            onClick={onSubmit}
                            disabled={isLoading || buttonDisabled}
                            className='w-100 mb-3 form__btn'
                        >
                            {!isLoading ? buttonText : `${buttonText.split(' ')[0]}ing...`}
                        </Button>

                        {successMsg && (
                            <div className='text-center mb-3 success-text text-break'>
                                {successMsg}
                                {showSignInLink && (
                                    <Link
                                        to='/sign-in'
                                        className='ms-2 text-nowrap fw-bold fs-6'
                                    >
                                        Sign in
                                    </Link>
                                )}
                            </div>
                        )}

                        {errorMsg && (
                            <div className='text-center mb-3 text-danger'>
                                {errorMsg}
                            </div>
                        )}

                        {expiredLinkBlock && (
                            <div className='text-center mb-3'>
                                {expiredLinkBlock}
                            </div>
                        )}

                        {extraLinks && (
                            <div className='text-center'>
                                {extraLinks}
                            </div>
                        )}
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}; 