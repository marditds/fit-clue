import { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { usePosts } from '../../lib/hooks/usePosts';
import { useUser } from '../../lib/hooks/useUser';
import { Form, Container, Row, Col, Modal, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Card } from '../../components/Grid/Card';
import { useShoppingLinks } from '../../lib/hooks/useShoppingLinks';
import { similarityLevelOptions } from '../../lib/data/similarityLevelOptions';
import { reportCategories } from '../../lib/data/reportCategories';
import { onePostData } from '../../lib/data/testData';
import '../../components/Post/Post.css';
import { SimilarityLevelToolTip } from '../../components/ToolTip/SimilarityLevelToolTip';
import { LoadingComponent } from '../../components/Loading/LoadingComponent';

const Post = () => {

    const { userId, username } = useOutletContext();

    let params = useParams()

    const { fetchPostById, fetchCommentsByPostId, createComment, updatePost, createReportPost } = usePosts();

    const { createLink } = useShoppingLinks();

    const [iUrl, setIUrl] = useState(null);
    const [personalityName, setPersonalityName] = useState(null);
    const [itemsLinks, setItemsLinks] = useState(null);
    const [isPostLoading, setIsPostLoading] = useState(false);

    // user added links
    const [companyName, setCompanyName] = useState('');
    const [itemName, setItemName] = useState('');
    const [href, setHref] = useState('');
    const [similarityLevel, setSimilarityLevel] = useState('');
    const [similarityLevelDesc, setSimilarityLevelDesc] = useState('');
    const [isAddningLink, setIsAddingLink] = useState(false);

    // Users' comment
    const [commentText, setCommentText] = useState('');
    const [commentsList, setCommentsList] = useState([]);
    const [isAddningComment, setIsAddingComment] = useState(false);
    const [isViewCommentsClicked, setIsViewCommentsClicked] = useState(false);



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

    // Get the comments for post
    useEffect(() => {
        const getCommentsByPostId = async () => {

            if (!isViewCommentsClicked) {
                return;
            }

            const comments = await fetchCommentsByPostId(params.postId);

            console.log('comments:', comments);

            setCommentsList(comments);


        }
        getCommentsByPostId();
    }, [isViewCommentsClicked])

    // The code for enabling insta view
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

    // Display the description for each similarity level
    useEffect(() => {
        let optionDesc = similarityLevelOptions.find(l => l.label === similarityLevel)

        setSimilarityLevelDesc(optionDesc?.description || '');

    }, [similarityLevel])

    const onCompanyNameCahnge = (e) => {
        setCompanyName(e.target.value);
    };

    const onItemNameChange = (e) => {
        setItemName(e.target.value);
    };

    const onUrlCahnge = (e) => {
        setHref(e.target.value);
    };

    const onSimilarityLevelChange = (e) => {
        setSimilarityLevel(e.target.value);
    };

    const onAddLinkSubmit = async (e) => {

        e.preventDefault();

        try {
            setIsAddingLink(true);

            const newLink = await createLink(href, companyName, itemName, userId, similarityLevel);

            const updatedPost = await updatePost(params.postId, newLink.$id);

            console.log('updatedPost in Post.jsx:', updatedPost);

            setItemsLinks((prevLinks) => [...(prevLinks || []), newLink]);

        } catch (error) {
            console.error('Error onAddSubmitLink:', error);
        } finally {
            setIsAddingLink(false);
            setCompanyName('');
            setItemName('');
            setHref('');
        }
    }

    const onCreateCommentSubmit = async (e) => {

        e.preventDefault();

        try {
            setIsAddingComment(true);

            const newComment = await createComment(params.postId, commentText, userId);

            console.log('comment in Post.jsx:', newComment);

            setCommentsList((prevComments) => [newComment, ...(prevComments || [])]);

        } catch (error) {
            console.error('Error onAddSubmitLink:', error);
        } finally {
            setIsAddingComment(false);
            setCommentText('');
        }
    }

    const onViewCommentsClick = () => {
        setIsViewCommentsClicked(true)
    }

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

    if (isPostLoading) return <div>Loading Instagram post…</div>;

    return (
        <Container className='min-vh-100 d-flex flex-column justify-content-center align-items-stretch'>
            <Row>
                <h3 className='text-left'>
                    {personalityName}
                </h3>
            </Row>
            <Row className=''>

                {/* image */}
                <Card
                    personalityName={personalityName}
                    iUrl={iUrl}
                />

                <Col className='post__col d-flex justify-content-center w-100'>
                    <div className='post__div-links w-100 h-100'>

                        {/* Items lists */}
                        {itemsLinks &&
                            <ul className='list-unstyled'>
                                <Row className='sticky-top mx-auto post__div-links-row'>
                                    <Col className='d-flex justify-content-center align-items-center'>
                                        Item
                                    </Col>
                                    <Col className='d-flex justify-content-center align-items-center'>
                                        Brand
                                    </Col>
                                    <Col className='d-flex justify-content-center align-items-center'>
                                        Similarity
                                    </Col>
                                    {/* <Col className='d-flex justify-content-center align-items-center'>
                                        Report
                                    </Col> */}
                                </Row>

                                {
                                    itemsLinks?.map((itemLink) => {
                                        return (
                                            <li key={itemLink.$id} className='border border-top-0 border-start-0 border-end-0 border-bottom-1 d-flex justify-content-center align-items-center w-100 post__div-link-item'>

                                                <Row className='w-100 d-flex justify-content-center align-items-center py-3'>
                                                    <a href={itemLink.href} target='_blank' className='d-flex align-items-center justify-content-center'>
                                                        <Col className='d-flex justify-content-center align-items-center'>
                                                            {/* <a href={itemLink.href} > */}
                                                            <div>
                                                                {itemLink.item}
                                                            </div>
                                                            {/* </a> */}
                                                        </Col>

                                                        <Col className='d-flex justify-content-center'>
                                                            {/* <a href={itemLink.href}> */}
                                                            {itemLink.company_name}
                                                            {/* </a> */}
                                                        </Col>
                                                        <Col className='d-flex justify-content-center text-center'>
                                                            {/* <a href={itemLink.href}> */}
                                                            {itemLink.similarity_level}
                                                            {/* </a> */}
                                                        </Col>
                                                    </a>

                                                    {/* <Col className='d-flex justify-content-center' style={{ maxWidth: 'fit-content' }}>
                                                        <Button onClick={() => handleReportClick(itemLink)}
                                                            className='post__report-btn'
                                                        >
                                                            <i className='bi bi-flag' />
                                                        </Button>
                                                    </Col> */}

                                                </Row>

                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        }

                        {/* Add items links */}
                        <Form onSubmit={onAddLinkSubmit} style={{ marginBottom: '0px' }}>
                            <h3>Add a linkcxsd</h3>
                            <Form.Group className='mb-3' controlId='CompanyNameField'>
                                <Form.Label>Brand:</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={companyName}
                                    onChange={onCompanyNameCahnge}
                                    placeholder='Enter Company Name' />
                            </Form.Group>

                            <Form.Group className='mb-3' controlId='ItemNameField'>
                                <Form.Label>Item:</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={itemName}
                                    onChange={onItemNameChange}
                                    placeholder='Enter Brand Name' />
                            </Form.Group>

                            <Form.Group className='mb-3' controlId='ItemUrlField'>
                                <Form.Label>URL:</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={href}
                                    onChange={onUrlCahnge}
                                    placeholder='Enter Item URL' />
                            </Form.Group>

                            <Form.Group className='mb-3' controlId='similarityLevelDropdownMenu'>

                                <Form.Label className='w-100'>
                                    Similarity Level:
                                    <SimilarityLevelToolTip>
                                        <ul className='text-start list-unstyled'>
                                            {similarityLevelOptions.map((option, idx) => (
                                                <li key={idx}><strong>{option.label}</strong> - {option.description}</li>
                                            ))}
                                        </ul>
                                    </SimilarityLevelToolTip>
                                </Form.Label>

                                <Form.Select
                                    aria-label='Select similarity level'
                                    name='similarityLevel'
                                    value={similarityLevel}
                                    onChange={onSimilarityLevelChange}
                                    required
                                >
                                    <option value='' disabled>Select similarity level</option>
                                    {similarityLevelOptions.map((option, idx) => (
                                        <option key={idx} value={option.label}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Text>{similarityLevelDesc}</Form.Text>
                            </Form.Group>


                            <Button
                                variant='primary'
                                type='submit'
                                disabled={!companyName || !itemName || !href}
                                className='mt-1'
                            >
                                {isAddningLink ? 'Adding link...' : 'Add Item Link'}
                            </Button>
                        </Form>
                    </div>

                </Col>

            </Row>

            <Row>
                <Col>
                    <h3>Comment section</h3>

                    <Form onSubmit={onCreateCommentSubmit}>

                        <Form.Group className='mb-3' controlId='userCommentEntryField'>
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter comment'
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <Form.Text className='text-muted'>
                                FitClue utilizes AI to ensure a safe and respectful environment for all users and visitos.
                            </Form.Text>
                        </Form.Group>

                        <Button type='submit'>
                            {!isAddningComment ? 'Submit' : <LoadingComponent />}
                        </Button>
                    </Form>
                </Col>
                <Col>
                    <Button onClick={onViewCommentsClick}>View Comments</Button>
                    {
                        isViewCommentsClicked && <ul>
                            {
                                commentsList.length > 0 ? commentsList?.map((comment, idx) => (
                                    <li key={idx}>{comment.comment_text}</li>
                                )) : <li>No comments yet</li>
                            }
                        </ul>
                    }

                </Col>
            </Row>

            {/* Report modal */}
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
                    <Button variant='secondary' onClick={handleClose}>
                        {isReportSubmitted ? 'Close' : 'Cancel'}
                    </Button>
                    {!isReportSubmitted && (
                        <Button variant='primary' disabled={!selectedReason || isReportGettingSubmitted} onClick={onSubmitReportPostClick}>
                            {!isReportGettingSubmitted ? 'Submit' : 'Submitting Report'}
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

        </Container >
    );
};

export default Post;
