import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { LoadingComponent } from '../Loading/Loading';
import './Form.css';
import ReCAPTCHA from 'react-google-recaptcha';

export const SignForm = ({
    title,
    subtitle,
    fields = [],
    onSubmit,
    submitText,
    disabled,
    loading,
    loadingText,
    error,
    links = [],
    hiddenField,
    backgroundImage,
    backgroundColClass = '',
    colImgClass = '',
    isXs = false,
    isSm = false,
    isMd = false,
    showReCaptcha = false,
    reCaptchaSiteKey,
    onReCaptchaChange,
    isReCaptchaVerficationLoading,
    reCaptchaErrorMessage,
    reCaptchaSuccessMessage,
    agreementText,
    onAgreementCheckboxChange
}) => {

    const location = useLocation();

    return (
        <Container className='min-vh-100 d-flex justify-content-center align-items-center'>
            <Row className='form__row w-100'>
                <Col xs={5} className={`${colImgClass} ${(isXs || isSm) ? 'd-none' : ''}`}></Col>

                <Col
                    style={{
                        backgroundImage: (isXs || isSm) ? `url(${backgroundImage})` : '',
                        height: location.pathname === '/sign-up' ? 'fit-content' : '650px'
                    }}
                    className={`form__col form__col-background-overlay d-flex justify-content-center align-items-center w-100 ${backgroundColClass}`}
                >
                    <Form className={(isXs) ? 'w-100' : 'w-75'}>
                        <div className='text-center my-4'>
                            <h3 className='mb-2'>{title}</h3>
                            {subtitle && <p className='text-muted'>{subtitle}</p>}
                        </div>

                        {fields.map(({ id, label, type, value, onChange, placeholder, afterElement }) => (
                            <Form.Group className='mb-3' controlId={id} key={id}>
                                <Form.Label>{label}</Form.Label>
                                <Form.Control
                                    type={type}
                                    value={value}
                                    onChange={onChange}
                                    placeholder={placeholder}
                                />
                                {afterElement}
                            </Form.Group>
                        ))}

                        {hiddenField && (
                            <Form.Group style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
                                <Form.Control
                                    type='text'
                                    id={hiddenField.id}
                                    name={hiddenField.name}
                                    value={hiddenField.value}
                                    onChange={hiddenField.onChange}
                                    autoComplete='off'
                                    tabIndex='-1'
                                    aria-hidden='true'
                                />
                            </Form.Group>
                        )}

                        {showReCaptcha && (
                            <Col
                                className={`mb-sm-3 form__recaptcha-col d-flex ${!isXs && !isSm && !isMd
                                    ? 'ms-auto'
                                    : 'mx-auto'
                                    }`}
                            >
                                {reCaptchaSiteKey ? (
                                    <ReCAPTCHA
                                        className='form__recaptcha-box'
                                        sitekey={reCaptchaSiteKey}
                                        onChange={onReCaptchaChange}
                                        onExpired={() => onReCaptchaChange(null)}
                                        onErrored={() => onReCaptchaChange(null)}
                                        aria-labelledby='recaptcha-label'
                                    />
                                ) : (
                                    <span id='recaptcha-label'>Loading ReCAPTCHA...</span>
                                )}
                            </Col>
                        )}

                        {isReCaptchaVerficationLoading && (
                            <Col
                                className={`mb-3 ${!isXs && !isSm && !isMd
                                    ? 'd-flex ms-auto'
                                    : 'd-flex mx-auto'
                                    }`}
                            >
                                <span id='recaptcha-verification-loading'>
                                    <LoadingComponent loadingText={'Verifying ReCaptcha'} />
                                </span>
                            </Col>
                        )
                        }

                        {reCaptchaErrorMessage && (
                            <Col
                                className={`mb-3 text-danger ${!isXs && !isSm && !isMd
                                    ? 'd-flex ms-auto'
                                    : 'd-flex mx-auto'
                                    }`}
                            >
                                <span role='alert'>{reCaptchaErrorMessage}</span>
                            </Col>
                        )}

                        {reCaptchaSuccessMessage && (
                            <Col
                                className={`mb-3 text-success ${!isXs && !isSm && !isMd
                                    ? 'd-flex ms-auto'
                                    : 'd-flex mx-auto'
                                    }`}
                            >
                                <span role='alert'>{reCaptchaSuccessMessage}</span>
                            </Col>
                        )}

                        {agreementText && (
                            <Col className='mb-3'>
                                <Form.Check
                                    type='checkbox'
                                    label={agreementText}
                                    onChange={onAgreementCheckboxChange}
                                    name='agreement'
                                    id='agreementCheckbox'
                                />
                            </Col>
                        )}

                        <Button
                            type='button'
                            onClick={onSubmit}
                            disabled={disabled}
                            className='w-100 mb-3 position-relative form__btn'
                        >
                            {
                                !loading ?
                                    submitText :
                                    <LoadingComponent loadingText={loadingText} />
                            }
                        </Button>

                        {error && (
                            <Form.Text className='text-danger d-block mb-3'>
                                {error}
                            </Form.Text>
                        )}

                        {links.length > 0 && (
                            <div className='text-center mb-4'>
                                {links.map(({ text, linkText, href }, idx) => (
                                    <div key={idx}>
                                        <span className='text-muted'>{text} </span>
                                        <Link to={href} className='text-decoration-none fw-medium'>
                                            {linkText}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}; 