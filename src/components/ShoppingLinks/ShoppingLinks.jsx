import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { shoppinglinksData } from './shoppingLinksData';
import { usePosts } from '../../lib/hooks/usePosts';

const ShoppingLinks = () => {

    const { fetchPosts } = usePosts();



    return (
        <Container className='min-vh-100 d-flex justify-content-end align-items-center'>
            <Row className=''>
                <Col>
                    <ul className='list-unstyled'>
                        <li>
                            asd
                        </li>

                    </ul>
                </Col>
            </Row>
        </Container>
    )
}

export default ShoppingLinks