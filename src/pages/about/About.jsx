import { Col, Container, Image, Row } from 'react-bootstrap';
import { LockComponent } from '../../components/Post/LockComponent';
import { useOutletContext } from 'react-router-dom';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import aboutImg from '../../assets/about.jpg';
import aboutColBg from '../../assets/aboutBg.jpg';
import { useDocumentTitle } from '../../lib/hooks/useDocumentTitle';
import { Hero } from '../../components/About/Hero';
import { Paragraphs } from '../../components/About/Paragraphs';
import { Quote } from '../../components/About/Quote';

const About = () => {

    useDocumentTitle('About | FitClue');

    const { isLoggedIn } = useOutletContext();

    const { isXs, isSm, isMd, isLg } = useBreakpoints();

    const isScreenLargeAndLarger = !isXs && !isSm && !isMd;

    return (
        <Container className='px-0' fluid>

            <Hero />

            {/* <section style={{ backgroundImage: `url(${aboutImg})`, backgroundSize: 'cover', height: '100px' }} /> */}

            {/* <hr className='my-0' /> */}

            {/* About text */}
            <Paragraphs />

            {/* Quote */}
            <Quote />

            {/* <hr className='my-0' /> */}

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
                                colClassName='text-center mb-5'
                                btnClassName={!isXs && !isSm ? 'w-25' : 'w-50'}
                                path='/sign-in'
                            />
                        </Col>
                    </Row>
                </Container>
            }

        </Container >
    )
}

export default About;