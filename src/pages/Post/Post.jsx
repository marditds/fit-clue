import { useState, useEffect } from 'react';
import { useParams, useOutletContext, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { Card } from '../../components/Card/Card';
import '../../components/Post/Post.css';
import { CommentSection } from '../../components/Post/CommentSection';
import { AddItemsLinks } from '../../components/Post/AddItemsLinks';
import { ItemsLinks } from '../../components/Post/ItemsLinks';
import { ScrollToTop } from '../../components/ScrollToTop/ScrollToTop';
import { usePosts } from '../../lib/hooks/usePosts';
import { LockComponent } from '../../components/Post/LockComponent';
import { authText } from '../../config/formText';
import { LoadingPage } from '../../components/Loading/Loading';
import { TextTooltipOnClick } from '../../components/ToolTip/CustomTooltip';
import { onePostData } from '../../lib/data/testData';

const Post = () => {

    const { userId, username, isLoggedIn } = useOutletContext();

    const params = useParams()

    const location = useLocation();

    const { fetchPostById } = usePosts();

    const [iUrl, setIUrl] = useState(null);
    const [personalityName, setPersonalityName] = useState(null);
    const [personalityId, setPersonalityId] = useState(null);
    const [itemsLinks, setItemsLinks] = useState(null);
    const [isPostLoading, setIsPostLoading] = useState(false);

    const currentUrl = window.location.origin + location.pathname;
    const [copyBtnTxt, setCopyBtnTxt] = useState('copy');
    const [isUrlCopied, setIsUrlCopied] = useState(false);

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

                setPersonalityName(post?.content.personality_name);
                setPersonalityId(post?.content.personality_id);
                setItemsLinks(post?.links);
                const rawUrl = post?.content.url;

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

    const handleCopy = () => {
        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                setIsUrlCopied(true);

                setTimeout(() => setIsUrlCopied(false), 800)
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
                setIsUrlCopied(false);
            });
    };

    if (isPostLoading) {
        return (
            <Container>
                <LoadingPage />
            </Container>
        );
    }

    return (
        <Container>
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
                    <div className={`post__div-links w-100 h-100 ${!isLoggedIn ? ' d-flex flex-column justify-content-between' : ''}`}>

                        {/* Items lists */}
                        <ItemsLinks
                            itemsLinks={itemsLinks}
                        />

                        {/* Link share field */}
                        <Row className='mx-auto w-100'>
                            <Col className='py-3 border border-bottom-1 border-top-0 border-start-0 border-end-0'>
                                <h3>Share This Page</h3>
                                <p className='mb-0'>
                                    Share this link with your network and ask for help completing this fashion collection!
                                </p>
                                <Form>
                                    <Form.Group controlId='share-url'>
                                        <InputGroup>
                                            <Form.Control
                                                value={currentUrl}
                                                readOnly
                                                className='me-2'
                                            />
                                            <TextTooltipOnClick
                                                isItemClicked={isUrlCopied}
                                                tooltipText={isUrlCopied && 'Copied!'}
                                            >
                                                <Button
                                                    type='button'
                                                    onClick={handleCopy}
                                                >
                                                    {copyBtnTxt}
                                                </Button>
                                            </TextTooltipOnClick>
                                        </InputGroup>
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>

                        {isLoggedIn ?

                            <AddItemsLinks
                                postId={params.postId}
                                userId={userId}
                                isLoggedIn={isLoggedIn}
                                setItemsLinks={setItemsLinks}
                            />
                            :

                            // Lock 
                            <LockComponent
                                btnText={`${authText.signIn.button}`}
                                lockTitle='Sign in to Add Links'
                                lockText='Sign in to start curating your own fashion shopping collection!'
                                divClassName='h-100'
                                rowClassName='mx-auto post__div-no-links-row h-100 pt-0 pt-md-4'
                                colClassName='text-center pb-4 pb-md-0 pt-4 pt-md-4'
                                btnClassName='w-25'
                                path='/sign-in'
                            />
                        }

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