import { Col, Container, Image, Row } from 'react-bootstrap';

const About = () => {
    return (
        <Container className='bg-success' fluid>
            <Container className='bg-info'>
                <Row className='py-4 py-sm-4 py-md-5'>
                    <Col className='my-4 my-sm-4 my-md-5'>
                        <h1 className='text-center mb-4 mb-sm-4 mb-md-5'>
                            About FitClue
                        </h1>
                        <h6 className='text-center'>
                            "Fashion is everywhere. Let's discover it together."
                        </h6>
                    </Col>
                </Row>


                <Row xs={1} lg={2}>
                    <Col className='my-auto'>
                        <p>
                            Fashion is everywhere — in the streets, on social media, and in the everyday outfits that catch our eye. But so often, when we see a piece we love, we are left wondering: What brand is that? Where can I find it?
                        </p>
                        <p>
                            Our app was built to answer those questions together. Instead of endless searching, users can upload or browse images of clothing and collaborate to identify the brands behind each item. Whether it is a pair of sneakers spotted in a photo, a jacket from a celebrity post, or a dress from a runway look, the community comes together to uncover the details.
                        </p>
                        <p>
                            Every piece is enriched with shared information — brand names, product links, and other helpful insights. The more the community contributes, the stronger the collective knowledge grows, making it easier for everyone to discover fashion they love.
                        </p>
                        <p>
                            This is not just about clothes; it is about connection. By combining curiosity, expertise, and a passion for style, users help each other explore new trends, learn about different labels, and bring inspiration into their own wardrobes.
                        </p>
                        <p>
                            We believe fashion should be collaborative and fun. And with every image identified, we are building a space where discovery is powered by people, not just algorithms.
                        </p>
                    </Col>
                    <Col className='d-none d-lg-block'>
                        <Image src='https://placehold.co/200x200' className='w-100' fluid />
                    </Col>
                </Row>

            </Container>



        </Container >
    )
}

export default About;