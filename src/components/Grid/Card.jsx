import { Col } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';

export const Card = ({ id, personality_name, iUrl }) => {

    const location = useLocation();

    return (
        <Col xs={12} md={6} xl={4} className='p-0 p-sm-2 d-flex justify-content-center'>
            <div style={{ width: '100%', maxWidth: '100%' }}>
                {
                    location.pathname !== '/post' &&
                    <Link to={`post/${id}`}>
                        <h3 className='text-left latest__card-name'>
                            {personality_name}
                        </h3>
                    </Link>
                }
                <blockquote
                    className='instagram-media'
                    data-instgrm-permalink={iUrl}
                    data-instgrm-version='14'
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
                            href={iUrl}
                            style={{
                                background: '#FFFFFF',
                                lineHeight: 0,
                                padding: '0 0',
                                textAlign: 'center',
                                textDecoration: 'none',
                                width: '100%',
                            }}
                            target='_blank'
                            rel='noreferrer'
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
    )
}