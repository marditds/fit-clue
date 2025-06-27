import { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { Form, Container, Row, Col, Modal, Button } from 'react-bootstrap';
import { Card } from '../../components/Grid/Card';
import { reportCategories } from '../../lib/data/reportCategories';
import { onePostData } from '../../lib/data/testData';
import '../../components/Post/Post.css';
import { CommentSection } from '../../components/Post/CommentSection';
import { AddItemsLinks } from '../../components/Post/AddItemsLinks';
import { ItemsLinks } from '../../components/Post/ItemsLinks';

const Post = () => {

    const { userId, username } = useOutletContext();

    let params = useParams()

    const [iUrl, setIUrl] = useState(null);
    const [personalityName, setPersonalityName] = useState(null);
    const [itemsLinks, setItemsLinks] = useState(null);
    const [isPostLoading, setIsPostLoading] = useState(false);

    // Report user generated links
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItemLinkId, setSelectedItemLinkId] = useState(null);
    const [selectedReason, setSelectedReason] = useState('');
    const [isOtherSelected, setIsOtherSelected] = useState(false);
    const [otherText, setOtherText] = useState('');
    const [isReportSubmitted, setIsReportSubmitted] = useState(false);
    const [isReportGettingSubmitted, setIsReportGettingSubmitted] = useState(false);

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
                // const post = await fetchPostById(params.postId);
                const post = onePostData;

                console.log('post in Post.jsx:', post);

                setPersonalityName(post?.personality?.name);
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

    const handleReportClick = (item) => {
        console.log('item:', item);
        setSelectedItem(item);
        setSelectedItemLinkId(item.$id);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedItem(null);
        setSelectedReason('');
        setOtherText('');
        setIsOtherSelected(false);
        setIsReportSubmitted(false);
    };

    const onSubmitReportPostClick = async () => {
        setIsReportGettingSubmitted(true);
        try {
            await createReportPost(selectedItemLinkId, selectedReason);

            setIsReportSubmitted(true);

            setTimeout(() => handleClose(), 2000);

        } catch (error) {
            console.error('Error submitting report:', error);
        } finally {
            setIsReportGettingSubmitted(false);
        }
    }

    if (isPostLoading) return <Container>Loading post…</Container>;

    return (
        <Container className='min-vh-100 d-flex flex-column justify-content-center align-items-stretch'>
            <Row>
                <h3 className='text-left'>
                    {personalityName}
                </h3>
            </Row>
            <Row>

                {/* image */}
                <Card
                    personalityName={personalityName}
                    iUrl={iUrl}
                />

                <Col className='post__col d-flex justify-content-center w-100'>
                    <div className='post__div-links w-100 h-100'>

                        {/* Items lists */}
                        {itemsLinks &&
                            <ItemsLinks
                                itemsLinks={itemsLinks}
                                handleReportClick={handleReportClick}
                            />
                        }

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
            />

            {/* Report Link modal */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Report Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isReportSubmitted ? (
                        <div>
                            <p>Your report has been submitted successfully.</p>
                        </div>
                    ) : (
                        <>
                            <p>
                                Reporting: <strong>{selectedItem?.item} from {selectedItem?.company_name}</strong>
                            </p>
                            <Form>
                                {reportCategories.map((category, index) => (
                                    <Form.Check
                                        type='radio'
                                        id={`report-${index}`}
                                        key={index}
                                        name='reportReason'
                                        label={<><strong>{category.label}</strong>: {category.description}</>}
                                        value={category.short}
                                        checked={selectedReason === category.short || (category.short === 'OTHER' && isOtherSelected)}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === 'OTHER') {
                                                setIsOtherSelected(true);
                                                setSelectedReason(otherText);
                                            } else {
                                                setIsOtherSelected(false);
                                                setOtherText('');
                                                setSelectedReason(value);
                                            }
                                        }}
                                    />
                                ))}

                                {isOtherSelected && (
                                    <div className='mt-3'>
                                        <Form.Label>
                                            Please describe the issue (max 300 characters)
                                        </Form.Label>
                                        <Form.Control
                                            as='textarea'
                                            rows={3}
                                            maxLength={300}
                                            value={otherText}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setOtherText(value);
                                                setSelectedReason(value);
                                            }}
                                        />
                                        <div className='text-muted text-end'>
                                            {otherText.length} / 300
                                        </div>
                                    </div>
                                )}
                            </Form>
                        </>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={handleClose}>
                        {isReportSubmitted ? 'Close' : 'Cancel'}
                    </Button>
                    {!isReportSubmitted && (
                        <Button disabled={!selectedReason || isReportGettingSubmitted} onClick={onSubmitReportPostClick}>
                            {!isReportGettingSubmitted ? 'Submit' : 'Submitting Report'}
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

        </Container >
    );
};

export default Post;
