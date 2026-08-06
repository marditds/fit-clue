import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

export const Paragraphs = () => {

    const aboutText = [
        {
            tagline: "The problem",
            title: "Love an outfit, but don't know where it's from?",
            description: "Fashion inspiration is everywhere: on Instagram, in the streets, at events, and in everyday life. Yet when you spot an outfit you love, finding the exact item or even something similar can be frustrating. Endless searching rarely leads to the answer.",
        },
        {
            tagline: "The solution",
            title: "Discover fashion together",
            description: "FitClue brings fashion lovers together to solve that problem. Share an Instagram post, browse existing discoveries, or help identify outfits for others. Whether it's a celebrity's dress, a creator's jacket, or a pair of sneakers that caught someone's eye, every contribution helps uncover where to find it or something beautifully similar.",
        },
        {
            tagline: "How it works",
            title: "Every contribution helps someone else",
            description: "Every post becomes part of a growing, searchable collection of Instagram fashion. Community members contribute brands, product links, and similar alternatives, making it easier for the next person to discover the outfit they fell in love with.",
        },
        {
            tagline: "Why it matters",
            title: "More than identifying clothes",
            description: "FitClue isn't just about identifying clothing. It's about sharing inspiration. Every contribution expands a community-built collection that helps fashion lovers discover brands, explore new styles, and find pieces they might never have found otherwise.",
        }
    ];

    return (
        <Container as='section' className=''>
            {
                aboutText.map((text, idx) => {
                    return (
                        <React.Fragment key={idx}>
                            <Row>
                                <Col xs={12} md={3} lg={2}>
                                    <p className='h6 text-muted' style={{ textTransform: 'uppercase', lineHeight: '24px' }}>
                                        {text.tagline}
                                    </p>
                                </Col>
                                <Col>
                                    <h2 className='h5'>
                                        {text.title}
                                    </h2>
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
