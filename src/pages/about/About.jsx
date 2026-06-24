import { Col, Container, Image, Row } from 'react-bootstrap';
import { LockComponent } from '../../components/Post/LockComponent';
import { useOutletContext } from 'react-router-dom';
import { useDocumentTitle } from '../../lib/hooks/useDocumentTitle';
import { Hero } from '../../components/About/Hero';
import { Paragraphs } from '../../components/About/Paragraphs';
import { Quote } from '../../components/About/Quote';
import { Graphics } from '../../components/About/Graphics';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';

const About = () => {

    useDocumentTitle('About | FitClue');

    const { isLoggedIn } = useOutletContext();

    const { isXs, isSm } = useBreakpoints();


    return (
        <>
            <Hero />

            <Graphics />

            <Paragraphs />

            <Quote />

            {/* CTA */}
            {
                !isLoggedIn &&
                <Container>
                    <Row>
                        <Col>
                            <LockComponent
                                btnText={`Sign in`}
                                lockTitle='Ready to Explore?'
                                lockText='Sign in to start curating your fashion shopping collection!'
                                rowClassName='my-0 my-md-5'
                                colClassName='text-center my-5 my-md-1'
                                btnClassName={!isXs && !isSm ? 'w-25' : 'w-50'}
                                path='/sign-in'
                            />
                        </Col>
                    </Row>
                </Container>
            }

        </>
    )
}

export default About;