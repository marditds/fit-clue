import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className='bg-light py-3 mt-5 border-top mt-auto'>
            <Container>
                <Row className='justify-content-between align-items-center'>
                    <Col xs='12' md='6' className='text-center text-md-start mb-2 mb-md-0'>
                        © {new Date().getFullYear()} FitClue
                    </Col>
                    <Col xs='12' md='6' className='text-center text-md-end'>
                        <Link to='/tos' className='mx-2 text-decoration-none'>Terms of Service</Link>
                        <Link to='/help' className='mx-2 text-decoration-none'>Help</Link>
                        <Link to='/stuff' className='mx-2 text-decoration-none'>Stuff</Link>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;