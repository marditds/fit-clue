import { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { usePosts } from '../../lib/hooks/usePosts';
import { useUser } from '../../lib/hooks/useUser';
import { Form, Container, Row, Col, Modal, Button } from 'react-bootstrap';
import { Card } from '../../components/Grid/Card';
import { useShoppingLinks } from '../../lib/hooks/useShoppingLinks';
import { reportCategories } from '../../lib/data/reportCategories';
import { onePostData } from '../../lib/data/testData';

const Post = () => {

    const { userId } = useOutletContext();

    let params = useParams()

    const { fetchPostById, updatePost, createReport } = usePosts();
    const { createLink } = useShoppingLinks();

    const [iUrl, setIUrl] = useState(null);
    const [personalityName, setPersonalityName] = useState(null);
    const [itemsLinks, setItemsLinks] = useState(null);
    const [isPostLoading, setIsPostLoading] = useState(false);

    // user added links
    const [companyName, setCompanyName] = useState('');
    const [itemName, setItemName] = useState('');
    const [href, setHref] = useState('');
    const [isAddningLink, setIsAddingLink] = useState(false);

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

    const onCompanyNameCahnge = (e) => {
        setCompanyName(e.target.value);
    };

    const onItemNameChange = (e) => {
        setItemName(e.target.value);
    };

    const onUrlCahnge = (e) => {
        setHref(e.target.value);
    };

    const onAddLinkSubmit = async (e) => {

        e.preventDefault();

        try {
            setIsAddingLink(true);

            const newLink = await createLink(href, companyName, itemName, userId);

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

    const onSubmitReportClick = async () => {
        setIsReportGettingSubmitted(true);
        try {
            await createReport(selectedItemLinkId, selectedReason);

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
            <Row>
                {/* image */}
                <Card xs={5}
                    personalityName={personalityName}
                    iUrl={iUrl}
                />

                <Col>
                    {/* Items lists */}
                    <ul className='list-unstyled'>
                        {
                            itemsLinks?.map((itemLink) => {
                                return (
                                    <li key={itemLink.$id} className='border border-top-0 border-start-0 border-end-0 border-bottom-1 d-flex'>
                                        <a href={itemLink.href}>
                                            <div>
                                                {itemLink.item}
                                            </div>
                                            <div>
                                                {itemLink.company_name}
                                            </div>
                                        </a>
                                        <Button onClick={() => handleReportClick(itemLink)}>Report</Button>
                                    </li>
                                )
                            })
                        }
                    </ul>

                    {/* Add items links */}
                    <Form onSubmit={onAddLinkSubmit}>
                        <Form.Group className='mb-3' controlId='CompanyNameField'>
                            <Form.Label>Company Name:</Form.Label>
                            <Form.Control
                                type='text'
                                value={companyName}
                                onChange={onCompanyNameCahnge}
                                placeholder='Enter Company Name' />
                        </Form.Group>

                        <Form.Group className='mb-3' controlId='ItemNameField'>
                            <Form.Label>Item Name</Form.Label>
                            <Form.Control
                                type='text'
                                value={itemName}
                                onChange={onItemNameChange}
                                placeholder='Enter Item Name' />
                        </Form.Group>

                        <Form.Group className='mb-3' controlId='ItemUrlField'>
                            <Form.Label>URL:</Form.Label>
                            <Form.Control
                                type='text'
                                value={href}
                                onChange={onUrlCahnge}
                                placeholder='Enter Item URL' />
                        </Form.Group>


                        <Button
                            variant='primary'
                            type='submit'
                            disabled={!companyName || !itemName || !href}
                        >
                            {isAddningLink ? 'Adding link...' : 'Add Item Link'}
                        </Button>
                    </Form>

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
                        <Button variant='primary' disabled={!selectedReason || isReportGettingSubmitted} onClick={onSubmitReportClick}>
                            {!isReportGettingSubmitted ? 'Submit' : 'Submitting Report'}
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

        </Container>
    );
};

export default Post;
