import { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useUser } from '../../lib/hooks/useUser';


export const ForgotPassword = () => {

    const { createPasswordRecoveryEmail } = useUser();

    const [email, setEmail] = useState('');
    const [thanksgivingWish, setThanksgivingWish] = useState('');
    const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
    const [forgotPsswdSuccessMsg, setForgotPsswdSuccessMsg] = useState(null);
    const [forgotPsswdErrorMsg, setForgotPsswdErrorMsg] = useState(null);

    const onForgotPasswordClick = async (event) => {

        event.preventDefault();

        if (thanksgivingWish) {
            setErrorMsg('Try again.');
            return;
        }

        try {
            setIsForgotPasswordLoading(true);

            console.log('onForgotPassword clicked.');

            const res = await createPasswordRecoveryEmail(email);

            if (typeof res === 'string') {
                setForgotPsswdErrorMsg(res);
                setForgotPsswdSuccessMsg(null);
                setEmail('');
                return;
            }

            console.log(res);

            setEmail('');
            setForgotPsswdSuccessMsg('A recovery link from Appwrite has been sent to your email. Please check your inbox.');
            setForgotPsswdErrorMsg('');
        } catch (error) {
            console.error('Error onForgotPassword:', error);
            setForgotPsswdErrorMsg('Something went wrong. Please try again later.');
        } finally {
            setIsForgotPasswordLoading(false);
        }
    }

    return (
        <Container>
            <Row>
                <Col>
                    <Form>
                        <Form.Group className='mb-3' controlId='emailField'>
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
                            <Form.Control
                                type='text'
                                id='thanksgivingWish'
                                name='thanksgivingWish'
                                value={thanksgivingWish}
                                onChange={(e) => setThanksgivingWish(e.target.value)}
                                autoComplete='off'
                                tabIndex='-1'
                                aria-hidden='true'
                            />
                        </Form.Group>

                        <Button
                            onClick={onForgotPasswordClick}
                            disabled={isForgotPasswordLoading || !!thanksgivingWish}
                        >
                            {!isForgotPasswordLoading ? 'Get Recovery Email' : 'Loading...'}
                        </Button>

                        <Form.Text>
                            {forgotPsswdSuccessMsg || forgotPsswdErrorMsg}
                        </Form.Text>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
