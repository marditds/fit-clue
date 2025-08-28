import { Col, Container, Image, Row } from 'react-bootstrap';
import { LockComponent } from '../../components/Post/LockComponent';
import { useOutletContext } from 'react-router-dom';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import aboutImg from '../../assets/about.jpg';
import aboutColBg from '../../assets/aboutBg.jpg';

const About = () => {

    const { isLoggedIn } = useOutletContext();

    const { isXs, isSm, isMd, isLg } = useBreakpoints();

    const isScreenLargeAndLarger = !isXs && !isSm && !isMd;

    return (
        <Container className='px-0' fluid>

            {/* Banner */}
            <Container fluid>
                <Row className='py-4 py-sm-3 py-lg-5'>
                    <Col className='text-center my-4 my-sm-3 my-lg-5'>
                        <h1 className='mb-4 mb-sm-3 mb-lg-5'>
                            About FitClue
                        </h1>
                        <h6>
                            "Fashion is everywhere. Let's discover it together."
                        </h6>
                    </Col>
                </Row>
            </Container>

            {/* <hr className='my-0' /> */}

            {/* About text */}
            <Container fluid={isScreenLargeAndLarger ? false : true}>
                <Row xs={1} lg={2}>
                    <Col
                        className='my-auto'
                        style={{
                            backgroundImage: isScreenLargeAndLarger || isLg ? '' : `url(${aboutColBg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: !isScreenLargeAndLarger ? 'center' : '',
                            backgroundColor: 'var(--main-white-shade)',
                        }}
                    >
                        <p>
                            Fashion is everywhere — in the streets, on social media, and in the everyday outfits that catch our eye. But so often, when we see a piece we love, we are left wondering: What brand is that? Where can I find it?
                        </p>
                        <p>
                            Our app was built to answer those questions together. Instead of endless searching, users can upload or browse images of clothing and collaborate to identify the brands behind each item. Whether it is a pair of sneakers spotted in a photo, a jacket from a celebrity post, or a dress from a runway look, the community comes together to uncover the details.
                        </p>
                        <p>
                            Every piece is enriched with shared information — brand names, item links, and other helpful insights. The more the community contributes, the stronger the collective knowledge grows, making it easier for everyone to discover fashion they love.
                        </p>
                        <p>
                            This is not just about clothes; it is about connection. By combining curiosity, expertise, and a passion for style, users help each other explore new trends, learn about different labels, and bring inspiration into their own wardrobes.
                        </p>
                        <p className='mb-0'>
                            We believe fashion should be collaborative and fun. And with every image identified, we are building a space where discovery is powered by people, not algorithms.
                        </p>
                    </Col>
                    <Col className='d-none d-lg-block'>
                        <Image
                            src={aboutImg}
                            className={`object-fit-cover w-100 ${!isScreenLargeAndLarger || !isLg ? '' : 'h-100'}`}
                            height={'600'}
                            width={'600'}
                        />
                    </Col>
                </Row>
            </Container>

            {/* <hr className='my-0' /> */}

            {/* Quote */}
            <Container fluid>
                <Row className='py-4 py-sm-3 py-lg-5'>
                    <Col className='text-center my-4 my-sm-3 my-lg-5'>
                        <h3 className='mb-0'>
                            "Discovery is powered by people, not just algorithms."
                        </h3>
                    </Col>
                </Row>
            </Container>

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