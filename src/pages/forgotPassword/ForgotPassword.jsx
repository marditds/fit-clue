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
                        <Button onClick={onForgotPasswordClick}>
                            Get Recovery Email
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
