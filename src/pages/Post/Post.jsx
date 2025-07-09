import { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { Card } from '../../components/Grid/Card';
import { onePostData } from '../../lib/data/testData';
import '../../components/Post/Post.css';
import { CommentSection } from '../../components/Post/CommentSection';
import { AddItemsLinks } from '../../components/Post/AddItemsLinks';
import { ItemsLinks } from '../../components/Post/ItemsLinks';
import { ScrollToTop } from '../../components/ScrollToTop/ScrollToTop';
import { usePosts } from '../../lib/hooks/usePosts';

const Post = () => {

    const { userId, username, isLoggedIn } = useOutletContext();

    let params = useParams()

    const { fetchPostById } = usePosts();

    const [iUrl, setIUrl] = useState(null);
    const [personalityName, setPersonalityName] = useState(null);
    const [personalityId, setPersonalityId] = useState(null);
    const [itemsLinks, setItemsLinks] = useState(null);
    const [isPostLoading, setIsPostLoading] = useState(false);

    useEffect(() => {
        console.log('userId:', userId);
    }, [userId])

    useEffect(() => {
        console.log('username:', username);
    }, [userId])

    // Get the post
    useEffect(() => {
        const getPosts = async () => {

            setIsPostLoading(true);

            try {
                const post = await fetchPostById(params.postId);
                // const post = onePostData;

                console.log('post in Post.jsx:', post);

                setPersonalityName(post?.personality?.name);
                setPersonalityId(post?.personality?.$id);
                setItemsLinks(post?.links);
                const rawUrl = post?.content?.url;

                if (rawUrl) {
                    try {
                        const url = new URL(rawUrl);
                        const parts = url.pathname.split('/').filter(Boolean);

                        const postIndex = parts.indexOf('p');
                        if (postIndex !== -1 && parts[postIndex + 1]) {
                            const postId = parts[postIndex + 1];
                            const cleanUrl = `https://www.instagram.com/p/${postId}/`;
                            setIUrl(cleanUrl);
                        }
                    } catch (error) {
                        console.error('Invalid URL', error);
                    }
                }
            } catch (error) {
                console.error('Error getting posts:', error);
            } finally {
                setIsPostLoading(false);
            }

        };

        getPosts();
    }, []);

    useEffect(() => {
        if (!iUrl) return;

        const script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        script.onload = () => {
            if (window.instgrm) {
                window.instgrm.Embeds.process();
            }
        };
        document.body.appendChild(script);
    }, [iUrl]);

    if (isPostLoading) return <Container>Loading post…</Container>;

    return (
        <Container
        // className='min-vh-100 d-flex flex-column justify-content-center align-items-stretch'
        >
            <Row>
                <h3 className='text-left'>
                    {personalityName}
                </h3>
            </Row>

            {/* Image and links */}
            <Row>

                {/* image */}
                <Card
                    personalityName={personalityName}
                    personalityId={personalityId}
                    iUrl={iUrl}
                />

                <Col className='post__col d-flex justify-content-center w-100'>
                    <div className='post__div-links w-100 h-100'>

                        {/* Items lists */}
                        <ItemsLinks
                            itemsLinks={itemsLinks}
                        />


                        {/* Add items links */}
                        <AddItemsLinks
                            postId={params.postId}
                            userId={userId}
                            setItemsLinks={setItemsLinks}
                        />

                    </div>
                </Col>

            </Row>

            {/* Comment section */}
            <CommentSection
                postId={params.postId}
                userId={userId}
                username={username}
                isLoggedIn={isLoggedIn}
            />

            <ScrollToTop />

        </Container >
    );
};

export default Post;
