import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { CardComponent } from './CardComponent';
import { usePosts } from '../../lib/hooks/usePosts';
import { testData } from './testData';

const Grid = () => {

    const { fetchPosts } = usePosts();

    // const [posts, setPosts] = useState([]);

    // useEffect(() => {
    //     const getPosts = async () => {
    //         const res = await fetchPosts();
    //         setPosts(res.documents);
    //     }
    //     getPosts();
    // }, [])

    // useEffect(() => {
    //     console.log(posts);
    // }, [posts])

    const posts = testData;

    return (
        <Container className='min-vh-100 d-flex justify-content-center align-items-center'>
            <Row className='w-100'>
                {
                    posts.map((post) => {
                        return (
                            <Col key={post.$id} className='p-0 m-3'>
                                <CardComponent
                                    personality_name={post.personality.name}
                                    item={post.links[0].item}
                                    href={post.links[0].href}
                                />
                            </Col>
                        )
                    })
                }
            </Row>
        </Container>
    )
}

export default Grid