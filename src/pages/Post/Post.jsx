import { useState, useEffect } from 'react';
import { useParams, useOutletContext, useLocation } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
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
import { SharePost } from '../../components/Post/SharePost';
import { Interaction } from '../../components/Post/Interaction';
import { onePostData } from '../../lib/data/testData';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import { UserNote } from '../../components/Post/UserNote';

const Post = () => {

    const { userId, username, isLoggedIn } = useOutletContext();

    const params = useParams()

    const location = useLocation();

    const { fetchPostById, updateUserNote: updateNote } = usePosts();

    const { isXs } = useBreakpoints();

    const [iUrl, setIUrl] = useState(null);
    const [personalityName, setPersonalityName] = useState(null);
    const [itemsLinks, setItemsLinks] = useState(null);
    const [userNote, setUserNote] = useState(null);
    const [newUserNote, setNewUserNote] = useState(null);
    const [postUserId, setPostUserId] = useState(null);
    const [isPostLoading, setIsPostLoading] = useState(false);

    // Get the post
    useEffect(() => {
        const getPosts = async () => {

            setIsPostLoading(true);

            try {
                const post = await fetchPostById(params.postId);
                // const post = onePostData;

                console.log('post in Post.jsx:', post);

                setPersonalityName(post?.content.personality_name);
                setItemsLinks(post?.links);
                setPostUserId(post?.content.user_id)
                setUserNote(post?.content.user_note);
                const rawUrl = post?.content.url;

                if (rawUrl) {
                    try {
                        const url = new URL(rawUrl);
                        const parts = url.pathname.split('/').filter(Boolean);

                        console.log('parts', parts);

                        if (parts[0] === 'p') {
                            const postIndex = parts.indexOf('p');

                            console.log('postIndex', postIndex);

                            if (postIndex !== -1 && parts[postIndex + 1]) {
                                const postId = parts[postIndex + 1];
                                const cleanUrl = `https://www.instagram.com/p/${postId}/`;
                                setIUrl(cleanUrl);
                            }
                        }

                        if (parts[0] === 'reel') {
                            const postIndex = parts.indexOf('reel');

                            console.log('postIndex', postIndex);

                            if (postIndex !== -1 && parts[postIndex + 1]) {
                                const postId = parts[postIndex + 1];
                                const cleanUrl = `https://www.instagram.com/reel/${postId}/`;
                                setIUrl(cleanUrl);
                            }
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

    // Instagram embed.js
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

    const updateUserNote = async () => {
        try {
            const res = await updateNote(params.postId, userNote, newUserNote);
            return res;
        } catch (error) {
            console.error('Error updating user note.');
        }
    }

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
                <h3
                    className='text-left mt-3 mb-0 mb-md-3'
                    style={{ paddingInline: !isXs ? '22px' : '10px' }}
                >
                    {personalityName}
                </h3>
            </Row>

            {/* Image and links */}
            <Row>

                {/* image */}
                <Card
                    personalityName={personalityName}
                    iUrl={iUrl}
                />

                <Col className='post__col d-flex justify-content-center w-100'>
                    <div className={`post__div-links w-100 h-100 ${!isLoggedIn ? ' d-flex flex-column justify-content-between' : ''}`}>

                        {/* User's note */}
                        <UserNote
                            userNote={userNote}
                            newUserNote={newUserNote}
                            userId={postUserId === userId}
                            locationPathname={location.pathname}
                            setUserNote={setUserNote}
                            setNewUserNote={setNewUserNote}
                            updateUserNote={updateUserNote}
                        />

                        {/* Items lists */}
                        <ItemsLinks
                            isLoggedIn={isLoggedIn}
                            itemsLinks={itemsLinks}
                        />

                        {/* Interaction buttons */}
                        <Interaction
                            postId={params.postId}
                            userId={userId}
                            isLoggedIn={isLoggedIn}
                        />

                        {/* Link share field */}
                        <SharePost />

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
                                lockText='Sign in to start curating your fashion shopping collection!'
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