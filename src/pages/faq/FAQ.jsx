import { Col, Container, Row } from 'react-bootstrap';
import { AccordionComponent } from '../../components/Accessories/AccordionComponent';
import { faq } from '../../lib/data/faq';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';

const FAQ = () => {

    const { isXs } = useBreakpoints();

    return (
        <Container>
            <Row>
                <Col>
                    <h2 className='my-3'>
                        Frequently Asked Questions
                    </h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    {
                        isXs &&
                        <AccordionComponent
                            itemsList={faq}
                            className='mb-3'
                        />
                    }
                    {
                        !isXs &&

                        <>
                            {
                                faq.map((item, idx) => (
                                    <div key={idx}>
                                        <h4 className=''>
                                            {item.title}
                                        </h4>
                                        <p>
                                            {item.desc}
                                        </p>
                                        <hr />
                                    </div>
                                ))
                            }
                        </>
                    }


                </Col>
            </Row>
        </Container>
    )
}

export default FAQ;
