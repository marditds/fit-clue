import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { CardComponent } from './CardComponent';
import { usePosts } from '../../lib/hooks/usePosts';
import { testData } from '../../lib/data/testData';

const Grid = () => {

    const { fetchPosts } = usePosts();

    // const [posts, setPosts] = useState([]);
    const [links, setLinks] = useState([]);
    const [personality, setPersonality] = useState(null);

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

    // useEffect(() => {
    //     console.log(posts);
    // }, [posts])

    return (
        <Container className='min-vh-100 d-flex justify-content-center align-items-center'>
            <Row className='w-100'>
                {/* {
                    posts.map((post) => {
                        return (
                            <Col key={post.$id}>
                            </Col>
                        )
                    })
                } */}
                {/* {
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
                } */}
            </Row>
        </Container>
    )
}

export default Grid