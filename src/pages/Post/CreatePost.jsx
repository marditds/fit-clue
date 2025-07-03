import { useState } from 'react';
import { usePosts } from '../../lib/hooks/usePosts.js';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import { AddLinksInCreatePostForm } from '../../components/Form/AddLinksInCreatePostForm.jsx';

const CreatePost = () => {

    const { userId } = useOutletContext();

    const { makePost } = usePosts();

    const [name, setName] = useState('');
    const [instaLink, setInstaLink] = useState('');
    const [showLinks, setShowLinks] = useState(false);
    const [links, setLinks] = useState([]);

    const addLinkField = () => {
        setLinks([...links, { href: '', companyName: '', item: '', similarityLevel: '' }]);
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
            // const filteredLinks = showLinks
            //     ? links.filter(link => link.href && link.companyName && link.item && link.userId && link.similarityLevel)
            //     : [];

            console.log('filteredLinks', links);


            const response = await makePost(name, links, instaLink, userId);
            if (response) {
                console.log('Post created successfully!');
            } else {
                console.error('Post creation failed.');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container>
            <Row>
                <Col className='px-md-5 pt-3 pt-md-5'>
                    <h2>
                        Create Post
                    </h2>
                    <p>
                        Share the Instagram link. The Instagram post must be available for public viewing.
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
                                    <Form.Label>Personality Name</Form.Label>
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
                                    <Form.Label>Instagram Link</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='https://www.instagram.com/...'
                                        value={instaLink}
                                        onChange={e => {
                                            console.log('instaLink:', e.target.value);

                                            setInstaLink(e.target.value)
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Show Links checkbox */}
                        <Row>
                            <Form.Group as={Col} controlId='formShowLinks'>
                                <Form.Check
                                    type='checkbox'
                                    label='Add Links'
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
                            />
                        )}

                        <Button
                            type='submit'
                            className='mt-3 w-100'
                            disabled={!name || !instaLink}
                        >
                            Create Post
                        </Button>

                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default CreatePost;