import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePosts } from '../../lib/hooks/usePosts';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { Card } from '../../components/Grid/Card';
import { useShoppingLinks } from '../../lib/hooks/useShoppingLinks';

const Post = () => {

    let params = useParams()

    const { fetchPostById, updatePost } = usePosts();
    const { createLink } = useShoppingLinks();

    const [iUrl, setIUrl] = useState(null);
    const [personalityName, setPersonalityName] = useState(null);
    const [itemsLinks, setItemsLinks] = useState(null);
    const [isPostLoading, setIsPostLoading] = useState(false);

    // user added links
    const [companyName, setCompanyName] = useState(null);
    const [itemName, setItemName] = useState(null);
    const [href, setHref] = useState(null);
    const [isAddningLink, setIsAddingLink] = useState(false);

    useEffect(() => {
        const getPosts = async () => {

            setIsPostLoading(true);

            try {
                const post = await fetchPostById(params.postId);

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

            const newLink = await createLink(href, companyName, itemName);

            const updatedPost = await updatePost(params.postId, newLink.$id);

            console.log('updatedPost in Post.jsx:', updatedPost);


        } catch (error) {
            console.error('Error onAddSubmitLink:', error);
        } finally {
            setIsAddingLink(false);
            setCompanyName(null);
            setItemName(null);
            setHref(null);
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
                <Card
                    personalityName={personalityName}
                    iUrl={iUrl}
                />

                <Col>
                    {/* Items lists */}
                    <ul className='list-unstyled'>
                        {
                            itemsLinks?.map((itemLink) => {
                                return (
                                    <li key={itemLink.$id} className='border border-top-0 border-start-0 border-end-0 border-bottom-1'>
                                        <a href={itemLink.href}>
                                            <div>
                                                {itemLink.item}
                                            </div>
                                            <div>
                                                {itemLink.company_name}
                                            </div>
                                        </a>
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
                                onChange={onCompanyNameCahnge}
                                placeholder='Enter Company Name' />
                        </Form.Group>

                        <Form.Group className='mb-3' controlId='ItemNameField'>
                            <Form.Label>Item Name</Form.Label>
                            <Form.Control
                                type='text'
                                onChange={onItemNameChange}
                                placeholder='Enter Item Name' />
                        </Form.Group>

                        <Form.Group className='mb-3' controlId='ItemUrlField'>
                            <Form.Label>URL:</Form.Label>
                            <Form.Control
                                type='text'
                                onChange={onUrlCahnge}
                                placeholder='Enter Item URL' />
                        </Form.Group>


                        <Button variant='primary' type='submit'>
                            {isAddningLink ? 'Adding link...' : 'Add Item Link'}
                        </Button>
                    </Form>

                </Col>

            </Row>
        </Container>
    );
};

export default Post;
