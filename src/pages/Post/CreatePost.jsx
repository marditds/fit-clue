import { useState } from 'react';
import { usePosts } from '../../lib/hooks/usePosts.js';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
// import { similarityLevelOptions } from '../../lib/data/similarityLevelOptions.js';
// import { CustomTooltip, TextTooltip } from '../../components/ToolTip/CustomTooltip.jsx';
import { AddLinksInCreatePostForm } from '../../components/Form/AddLinksInCreatePostForm.jsx';

const CreatePost = () => {

    const { userId } = useOutletContext();

    const { makePost, fetchPosts } = usePosts();

    const [name, setName] = useState('');
    const [photoLink, setPhotoLink] = useState('');
    const [showLinks, setShowLinks] = useState(false);
    const [links, setLinks] = useState([]);

    // useEffect(() => {
    //     fetchPosts();
    // }, []);

    // const handleLinkChange = (index, e) => {
    //     const { name, value } = e.target;
    //     const updatedLinks = [...links];
    //     updatedLinks[index][name] = value;
    //     setLinks(updatedLinks);
    // };

    const addLinkField = () => {
        setLinks([...links, { href: '', companyName: '', item: '', similarityLevel: '' }]);
    };

    // const removeLinkField = (indexToRemove) => {
    //     const updatedLinks = links.filter((_, index) => index !== indexToRemove);
    //     setLinks(updatedLinks);
    // };

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
        <Container className='min-vh-100 d-flex flex-column justify-content-center align-items-center'>
            <Row>
                <Col>
                    <h2>
                        Create Post
                    </h2>
                    <p>
                        Share the Instagram link. The Instagram post must be available for public viewing.
                    </p>
                </Col>
            </Row>
            <Row className='w-100'>
                <Col>
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
                                        value={photoLink}
                                        onChange={e => {
                                            console.log('photoLink:', e.target.value);

                                            setPhotoLink(e.target.value)
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Show Links checkbox */}
                        <Row>
                            <Form.Group as={Col} className='mb-3' controlId='formShowLinks'>
                                <Form.Check
                                    type='checkbox'
                                    label='Add Links'
                                    checked={showLinks}
                                    onChange={handleCheckboxChange}
                                />
                            </Form.Group>
                        </Row>

                        {/* Items info + links */}
                        {showLinks && (
                            // <Row className='flex-column'>
                            //     {links.map((link, index) => (
                            //         <Col key={index} className='mb-2'>
                            //             <hr className='mt-0' />
                            //             <Row>
                            //                 <Col className='d-flex align-items-center mb-3'>
                            //                     <h5 className='mb-0 me-2'>
                            //                         Link #{index + 1}
                            //                     </h5>
                            //                     <Button variant='danger' onClick={() => removeLinkField(index)}>
                            //                         Remove
                            //                     </Button>
                            //                 </Col>
                            //             </Row>


                            //             <Row xs={1} md={2}>
                            //                 <Form.Group as={Col} className='mb-3' controlId={`formProductLink-${index}`}>
                            //                     <Form.Label>Product Link</Form.Label>
                            //                     <Form.Control
                            //                         name='href'
                            //                         placeholder='https://shop.example.com/product'
                            //                         value={link.href}
                            //                         onChange={e => handleLinkChange(index, e)}
                            //                         required
                            //                     />
                            //                 </Form.Group>

                            //                 <Form.Group as={Col} className='mb-3' controlId={`formBrandName-${index}`}>
                            //                     <Form.Label>Company name</Form.Label>
                            //                     <Form.Control
                            //                         name='companyName'
                            //                         placeholder='Enter company Name'
                            //                         value={link.companyName}
                            //                         onChange={e => handleLinkChange(index, e)}
                            //                         required
                            //                     />
                            //                 </Form.Group>
                            //             </Row>

                            //             <Row xs={1} md={2} className='align-items-end'>
                            //                 <Form.Group as={Col} className='mb-3' controlId={`formItemName-${index}`}>
                            //                     <Form.Label>Item</Form.Label>
                            //                     <Form.Control
                            //                         name='item'
                            //                         placeholder='Enter item name'
                            //                         value={link.item}
                            //                         onChange={e => handleLinkChange(index, e)}
                            //                         required
                            //                     />
                            //                 </Form.Group>

                            //                 <Form.Group as={Col} className='mb-3'>
                            //                     <Form.Label htmlFor={`similarityLevelSelect-${index}`}>
                            //                         Similarity Level
                            //                     </Form.Label>
                            //                     <CustomTooltip tooltipText={similarityLevelOptions}
                            //                         iconClassName={'bi bi-question-square'}
                            //                     />
                            //                     <Form.Select
                            //                         aria-label='Select similarity level'
                            //                         name='similarityLevel'
                            //                         id={`similarityLevelSelect-${index}`}
                            //                         value={link.similarityLevel}
                            //                         onChange={e => handleLinkChange(index, e)}
                            //                         required
                            //                     >
                            //                         <option value='' disabled>
                            //                             Select similarity level
                            //                         </option>
                            //                         {similarityLevelOptions.map((option, idx) => (
                            //                             <option key={idx} value={option.label}>
                            //                                 {option.label}
                            //                             </option>
                            //                         ))}
                            //                     </Form.Select>
                            //                 </Form.Group>

                            //             </Row>

                            //         </Col>
                            //     ))}

                            //     <Col>
                            //         <Button
                            //             type='button'
                            //             className='w-100'
                            //             onClick={addLinkField}>
                            //             <i className='bi bi-plus-square' /> Add Another Link
                            //         </Button>
                            //     </Col>

                            // </Row>
                            <AddLinksInCreatePostForm
                                links={links}
                                setLinks={setLinks}
                                addLinkField={addLinkField}
                            />
                        )}

                        <Button
                            type='submit'
                            className='mt-3 w-100'
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