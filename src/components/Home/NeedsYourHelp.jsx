import { useState, useEffect } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Icon } from '../Accessories/Icon'
import { usePosts } from '../../lib/hooks/usePosts'
import { LoadingComponent } from '../Loading/Loading'
import { devError, devLog } from '../../lib/utils/devConsole'
import { InstagramEmbedCards } from '../Post/InstagramEmbedCards '

export const NeedsYourHelp = () => {

    const { fetchPostsByContributionNumber } = usePosts();

    const [posts, setPosts] = useState([]);
    const [isGridLoading, setIsGridLoading] = useState(false);

    useEffect(() => {
        const getPostsByContributionNumber = async () => {
            setIsGridLoading(true);
            try {
                const p = await fetchPostsByContributionNumber(0, 3, null);

                devLog('posts without contriubtion in NeedYourHelp.jsx', p);

                setPosts(p.rows);

            } catch (error) {
                devError('Error getting posts:', error);
            } finally {
                setIsGridLoading(false);
            }
        };
        getPostsByContributionNumber();
    }, []);

    return (
        <section className='py-4 py-md-5 secondary-bg-color'>
            <Container>
                <Row className='justify-content-start'>
                    <Col className='secondary-text-color'>
                        <div className='d-flex justify-content-between align-items-center'>
                            <h5 className='text-uppercase'>
                                Needs your help
                            </h5>
                            <Link to='/search?category=needs-help'>
                                See all
                            </Link>
                        </div>
                        <p>
                            These posts have <span className=' text-black fw-bold'>no contributions yet</span>. Be the first to identify the item(s).
                        </p>
                    </Col>
                </Row>

                <Row>
                    {isGridLoading ?
                        <LoadingComponent loadingText={'Loading the posts that need your help'} /> :
                        (
                            posts.length > 0 ? <InstagramEmbedCards
                                posts={posts}
                            /> :
                                <Col>
                                    Nothing to show here, yet...
                                </Col>
                        )
                    }
                </Row>
            </Container>
        </section>
    )
}
