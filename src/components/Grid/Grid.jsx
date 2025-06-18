import { useState, useEffect } from 'react';
import { usePosts } from '../../lib/hooks/usePosts';
import { Col, Container, Row } from 'react-bootstrap';
import './CardComponent';
import './Grid.css';
import { CardComponent } from './CardComponent';

const Grid = () => {
    const { fetchPosts } = usePosts();
    const [postUrls, setPostUrls] = useState([]);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const getPosts = async () => {
            const p = await fetchPosts();

            console.log('posts', p);

            setPosts(p);

        };

        getPosts();
    }, []);

    useEffect(() => {
        if (posts.length === 0) return;

        const script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        script.onload = () => {
            if (window.instgrm) {
                window.instgrm.Embeds.process();
            }
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [posts]);


    if (posts.length === 0) return <div>Loading Instagram posts…</div>;

    return (
        <Container className='min-vh-100 d-flex flex-column justify-content-center align-items-center '>
            <Row className='w-100 justify-content-start'>
                <Col className='p-0 p-sm-2'>
                    <h2 className='latest__page-title'>
                        THE LATEST
                    </h2>
                </Col>
            </Row>
            <Row className='w-100 hakop'>
                {posts.map((post, index) => {
                    const rawUrl = post?.post?.url;
                    const name = post?.personality?.name;

                    // Extract Instagram post URL
                    let embedUrl = null;
                    try {
                        const url = new URL(rawUrl);
                        const parts = url.pathname.split('/').filter(Boolean);
                        const postIndex = parts.indexOf('p') !== -1 ? parts.indexOf('p') : parts.indexOf('reel');
                        if (postIndex !== -1 && parts[postIndex + 1]) {
                            const postId = parts[postIndex + 1];
                            embedUrl = `https://www.instagram.com/${parts[postIndex]}/${postId}/`;
                        }
                    } catch (e) {
                        console.error('Invalid URL:', rawUrl);
                    }
                    return (

                        <Col key={index} xs={12} md={6} xl={4} className="p-0 p-sm-2 d-flex justify-content-center">
                            <div style={{ width: '100%', maxWidth: '100%' }}>
                                <h3 className='text-left latest__card-name'>{name}</h3>
                                <blockquote
                                    className="instagram-media"
                                    data-instgrm-permalink={embedUrl}
                                    data-instgrm-version="14"
                                    style={{
                                        background: '#FFF',
                                        border: 0,
                                        borderRadius: '3px',
                                        boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                                        margin: '1rem 0',
                                        maxWidth: '540px',
                                        minWidth: '0',
                                        width: '100%',
                                        padding: 0,
                                    }}
                                >
                                    <div style={{ padding: '16px' }}>
                                        <a
                                            href={embedUrl}
                                            style={{
                                                background: '#FFFFFF',
                                                lineHeight: 0,
                                                padding: '0 0',
                                                textAlign: 'center',
                                                textDecoration: 'none',
                                                width: '100%',
                                            }}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <div style={{ paddingTop: '8px' }}>
                                                <div
                                                    style={{
                                                        color: '#3897f0',
                                                        fontFamily: 'Arial,sans-serif',
                                                        fontSize: '14px',
                                                        fontWeight: 550,
                                                        lineHeight: '18px',
                                                    }}
                                                >
                                                    View this post on Instagram
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </blockquote>
                            </div>
                        </Col>
                    );
                })}
            </Row>
        </Container>


    );
};

export default Grid;
