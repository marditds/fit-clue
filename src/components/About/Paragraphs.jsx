import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

export const Paragraphs = () => {

    const aboutText = [
        {
            tagline: "The problem",
            title: "What brand is that?",
            description: "Fashion is everywhere. It is in the streets, on social media, and in the everyday outfits that catch our eye. But so often, when we see a piece we love, we are left wondering: what brand is that? Where can I find it?",
        },
        {
            tagline: "The solution",
            title: "Built to answer that, together",
            description: "Instead of endless searching, users can upload or browse images of clothing and collaborate to identify the brands behind each item. Whether it is a pair of sneakers spotted in a photo, a jacket from a celebrity post, or a dress from a runway look, the community comes together to uncover the details.",
        },
        {
            tagline: "How it works",
            title: "Shared knowledge, growing every day",
            description: "Every piece is enriched with shared information such as brand names, item links, and other helpful insights. The more the community contributes, the stronger the collective knowledge grows, making it easier for everyone to discover fashion they love.",
        },
        {
            tagline: "Why it matters",
            title: "More than clothes — connection",
            description: "This is not just about clothes; it is about connection. By combining curiosity, expertise, and a passion for style, users help each other explore new trends, learn about different labels, and bring inspiration into their own wardrobes.",
        }
    ];

    return (
        <Container as='section'>
            {
                aboutText.map((text, idx) => {
                    return (
                        <React.Fragment key={idx}>
                            <Row>
                                <Col xs={12} md={3} lg={2}>
                                    <h6 className='text-muted' style={{ textTransform: 'uppercase', lineHeight: '24px' }}>
                                        {text.tagline}
                                    </h6>
                                </Col>
                                <Col>
                                    <h5>
                                        {text.title}
                                    </h5>
                                    <p className='m-0'>
                                        {text.description}
                                    </p>
                                </Col>
                            </Row>
                            {idx < aboutText.length - 1 && <hr className='my-4' />}
                        </React.Fragment>
                    )
                })
            }
        </Container>
    )
}
