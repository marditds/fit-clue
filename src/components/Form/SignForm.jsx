import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LoadingComponent } from '../Loading/LoadingComponent';
import './SignPasswordForm.css';

export const SignForm = ({
    title,
    subtitle,
    fields = [],
    onSubmit,
    submitText,
    disabled,
    loading,
    error,
    links = [],
    hiddenField,
    backgroundImage,
    backgroundColClass = '',
    colImgClass = '',
    isXs = false,
    isSm = false
}) => {
    return (
        <Container className='min-vh-100 d-flex justify-content-center align-items-center'>
            <Row className='form__row w-100'>
                <Col xs={5} className={`${colImgClass} ${(isXs || isSm) ? 'd-none' : ''}`}></Col>

                <Col
                    style={{
                        backgroundImage: (isXs || isSm) ? `url(${backgroundImage})` : ''
                    }}
                    className={`form__col form__col-background-overlay d-flex justify-content-center align-items-center w-100 ${backgroundColClass}`}
                >
                    <Form className={(isXs) ? 'w-100' : 'w-75'}>
                        <div className='text-center mb-4'>
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

                        <Button
                            type='button'
                            onClick={onSubmit}
                            disabled={disabled}
                            className='w-100 mb-3 position-relative form__btn'
                        >
                            {
                                !loading ?
                                    submitText :
                                    <LoadingComponent />
                            }
                        </Button>

                        {error && (
                            <Form.Text className='text-danger d-block mb-3'>
                                {error}
                            </Form.Text>
                        )}

                        {links.length > 0 && (
                            <div className='text-center'>
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