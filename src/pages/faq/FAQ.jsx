import { Col, Container, Row } from 'react-bootstrap';
import { AccordionFAQ } from '../../components/Accessories/AccordionComponent';
import { faq } from '../../lib/data/faq';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import { Link } from 'react-router-dom';

const FAQ = () => {

    const { isXs } = useBreakpoints();

    return (
        <Container>
            <Row>
                <Col>
                    <h2 className='mt-3'>
                        Frequently Asked Questions
                    </h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <AccordionFAQ
                        arrList={faq}
                        className='mb-5'
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>
                        Can't find your answer? <Link to='/support'>Contact us</Link> and we'll get back to you within 1-2 business days.
                    </p>
                </Col>
            </Row>
        </Container>
    )
}

export default FAQ;
