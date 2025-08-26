import { useEffect, useState } from 'react';
import { usePosts } from '../../lib/hooks/usePosts.js';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { AddLinksInCreatePostForm } from '../../components/Form/AddLinksInCreatePostForm.jsx';
import { LoadingComponent, LoadingPage } from '../../components/Loading/Loading.jsx';
import { Icon } from '../../components/Accessories/Icon.jsx';

const CreatePost = () => {

    const { userId, isAppLoading } = useOutletContext();

    const navigate = useNavigate();

    const { makePost } = usePosts();

    const [name, setName] = useState('');
    const [instaLink, setInstaLink] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [sccssMsg, setSccssMsg] = useState('');
    const [links, setLinks] = useState([]);
    const [incorrectlyFormattedLinks, setIncorrectlyFormattedLinks] = useState([]);
    const [showLinks, setShowLinks] = useState(false);
    const [isPostGettingCreated, setIsPostGettingCreated] = useState(false);
    const [isInstaLinkFormatIncorrect, setIsInstaLinkFormatIncorrect] = useState(false);
    const [isItemLinkFormatIncorrect, setIsItemLinkFormatIncorrect] = useState(false);

    const onInstagramLinkChange = (e) => {
        setInstaLink(e.target.value)
    }

    const addLinkField = () => {
        setLinks([...links, { href: '', brandName: '', item: '', similarityLevel: '' }]);
    };

    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setShowLinks(checked);
        if (checked && links.length === 0) {
            addLinkField();
        } else if (!checked) {
            setLinks([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsPostGettingCreated(true);

            const itemLinkInIncorrectFormat = links?.some((link) => !link.href.startsWith('https://'));

            console.log('itemLinkInIncorrectFormat', itemLinkInIncorrectFormat);

            const wronglyFormattedLinks = links.map(link => !link.href.startsWith('https://'));

            setIncorrectlyFormattedLinks(wronglyFormattedLinks);

            if (itemLinkInIncorrectFormat) {
                setErrMsg('One or more item links are incorrectly formatted. All links must begin with https://');
                setIsItemLinkFormatIncorrect(true);
                setSccssMsg('');
                return;
            }

            if (!instaLink.startsWith('https://www.instagram.com/p/')) {
                setErrMsg('The instagram link must be in the following format: https://www.instagram.com/p/...');
                setIsInstaLinkFormatIncorrect(true);
                setSccssMsg('');
                return;
            }

            const createdPost = await makePost(name, links, instaLink, userId);

            if (createdPost) {
                console.log('Post created successfully!');
                setErrMsg('');
                setSccssMsg('Post created successfully!');
                navigate(`/post/${createdPost.$id}`);
                setName('');
                setInstaLink('');
                setLinks([]);
            } else {
                console.error('Post creation failed.');
                setErrMsg('Something went wrong. Please try again later.');
                setSccssMsg('');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsPostGettingCreated(false);
        }
    };

    if (isAppLoading) {
        return <LoadingPage />
    }

    return (
        <Container>
            <Row>
                <Col className='px-md-5 pt-3 pt-md-5'>
                    <h2>
                        <Icon className='bi bi-plus-square' marginEndSize='2' />Create
                    </h2>
                    <p>
                        Please share the Instagram link. The post must be publicly accessible.
                    </p>
                </Col>
            </Row>

            <Row>
                <Col className='pt-md-3 px-md-5 mb-3 mb-md-0'>
                    <Form onSubmit={handleSubmit}>

                        {/* Personality name and insta link */}
                        <Row xs={1} md={2}>
                            <Col>
                                <Form.Group className='mb-3' controlId='formName'>
                                    <Form.Label>
                                        <Icon className='bi bi-person fs-5' marginEndSize='1' />
                                        Personality Name
                                    </Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter personality name'
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className='mb-3' controlId='formPhotoLink'>
                                    <Form.Label>
                                        <Icon className='bi bi-instagram fs-5' marginEndSize='2' />
                                        <Icon className='bi bi-link fs-5' marginEndSize='2' />
                                        Instagram Post Link
                                    </Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='https://www.instagram.com/p/...'
                                        value={instaLink}
                                        className={`border ${!isInstaLinkFormatIncorrect ? '' : 'border-danger'}`}
                                        onChange={onInstagramLinkChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Show Links checkbox */}
                        <Row>
                            <Form.Group as={Col} controlId='formShowLinks'>
                                <Form.Check
                                    type='checkbox'
                                    label='Add Item Links'
                                    checked={showLinks}
                                    onChange={handleCheckboxChange}
                                    className='mb-0'
                                />
                            </Form.Group>
                        </Row>

                        {/* Items info + links */}
                        {showLinks && (
                            <AddLinksInCreatePostForm
                                links={links}
                                setLinks={setLinks}
                                addLinkField={addLinkField}
                                incorrectlyFormattedLinks={incorrectlyFormattedLinks}
                            />
                        )}

                        <Button
                            type='submit'
                            className='mt-3 w-100 mb-3'
                            disabled={!name || !instaLink}
                        >
                            {!isPostGettingCreated ?
                                <>
                                    <Icon className='bi bi-plus-square' marginEndSize='2' />
                                    Create Post
                                </> :
                                <LoadingComponent />}
                        </Button>

                        <Form.Text className={sccssMsg ? 'text-success' : 'text-danger'}>
                            {sccssMsg || errMsg}
                        </Form.Text>

                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default CreatePost;