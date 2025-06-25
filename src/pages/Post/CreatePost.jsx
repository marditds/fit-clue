import { useState, useEffect } from 'react';
import { usePosts } from '../../lib/hooks/usePosts.js';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import { similarityLevelOptions } from '../../lib/data/similarityLevelOptions.js';

const CreatePost = () => {

    const { userId } = useOutletContext();

    const { makePost, fetchPosts } = usePosts();

    const [name, setName] = useState('');
    const [photoLink, setPhotoLink] = useState('');
    const [similarityLevel, setSimilarityLevel] = useState('');
    const [showLinks, setShowLinks] = useState(false);
    const [links, setLinks] = useState([]);

    // useEffect(() => {
    //     fetchPosts();
    // }, []);

    const handleLinkChange = (index, e) => {
        const { name, value } = e.target;
        const updatedLinks = [...links];
        updatedLinks[index][name] = value;
        setLinks(updatedLinks);
    };

    const addLinkField = () => {
        setLinks([...links, { href: '', companyName: '', item: '', similarityLevel: '' }]);
    };

    const removeLinkField = (indexToRemove) => {
        const updatedLinks = links.filter((_, index) => index !== indexToRemove);
        setLinks(updatedLinks);
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


            const response = await makePost(name, links, photoLink, userId);
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
        <Container className='min-vh-100 d-flex justify-content-center align-items-center'>
            <Row className='w-100'>
                {/* <Col xs={5}>
                    <h3>Preview</h3>


                </Col> */}

                <Col>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPhotoLink">
                            <Form.Label>Photo Link:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={photoLink}
                                onChange={e => {
                                    console.log('photoLink:', e.target.value);

                                    setPhotoLink(e.target.value)
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formShowLinks">
                            <Form.Check
                                type="checkbox"
                                label="Add Links"
                                checked={showLinks}
                                onChange={handleCheckboxChange}
                            />
                        </Form.Group>

                        {showLinks && (
                            <div>
                                <Form.Label>Links:</Form.Label>
                                {links.map((link, index) => (
                                    <Row key={index} className="mb-2">

                                        <Col>
                                            <Form.Control
                                                name="href"
                                                placeholder="Link URL"
                                                value={link.href}
                                                onChange={e => handleLinkChange(index, e)}
                                                required
                                            />
                                        </Col>

                                        <Col>
                                            <Form.Control
                                                name="companyName"
                                                placeholder="Company Name"
                                                value={link.companyName}
                                                onChange={e => handleLinkChange(index, e)}
                                                required
                                            />
                                        </Col>

                                        <Col>
                                            <Form.Control
                                                name="item"
                                                placeholder="Item"
                                                value={link.item}
                                                onChange={e => handleLinkChange(index, e)}
                                                required
                                            />
                                        </Col>

                                        <Col>
                                            <Form.Select
                                                aria-label="Select similarity level"
                                                name="similarityLevel"
                                                id={`similarityLevelSelect-${index}`}
                                                value={link.similarityLevel}
                                                onChange={e => handleLinkChange(index, e)}
                                                required
                                            >
                                                <option value="" disabled>Select similarity level</option>
                                                {similarityLevelOptions.map((option, idx) => (
                                                    <option key={idx} value={option}>{option}</option>
                                                ))}
                                            </Form.Select>
                                        </Col>

                                        <Col xs="auto">
                                            <Button variant="danger" onClick={() => removeLinkField(index)}>
                                                Remove
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                                <Button variant="secondary" type="button" onClick={addLinkField}>
                                    + Add Another Link
                                </Button>
                            </div>
                        )}

                        <Button
                            variant="primary"
                            type="submit"
                            className="mt-3"
                            disabled={!name || !photoLink}
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