import { Button, Col, Form, Row } from 'react-bootstrap'
import { similarityLevelOptions } from '../../lib/data/similarityLevelOptions';
import { CustomTooltip } from '../Accessories/CustomTooltip';
import { Icon } from '../Accessories/Icon';

export const AddLinksInCreatePostForm = ({
    links,
    setLinks,
    addLinkField,
    incorrectlyFormattedLinks
}) => {

    const handleLinkChange = (index, e) => {
        const { name, value } = e.target;
        const updatedLinks = [...links];
        updatedLinks[index][name] = value;
        setLinks(updatedLinks);
    };

    const removeLinkField = (indexToRemove) => {
        const updatedLinks = links.filter((_, index) => index !== indexToRemove);
        setLinks(updatedLinks);
    };

    return (
        <Row className='flex-column'>
            {links.map((link, index) => (
                <Col key={index}>
                    <hr className='mt-0' />
                    <Row>
                        <Col className='d-flex align-items-center mb-3'>
                            <h5 className='mb-0 me-2'>
                                Link #{index + 1}
                            </h5>
                            <Button variant='danger' onClick={() => removeLinkField(index)}>
                                Remove
                            </Button>
                        </Col>
                    </Row>


                    <Row xs={1} md={2}>
                        <Form.Group as={Col} className='mb-3' controlId={`formProductLink-${index}`}>
                            <Form.Label>Product Link</Form.Label>
                            <Form.Control
                                name='href'
                                placeholder='https://shop.example.com/product'
                                value={link.href}
                                onChange={(e) => {
                                    handleLinkChange(index, e);
                                }}

                                className={`border ${incorrectlyFormattedLinks[index] ? 'border-danger' : 'lezu'}`}

                                required
                            />
                        </Form.Group>

                        <Form.Group as={Col} className='mb-3' controlId={`formBrandName-${index}`}>
                            <Form.Label>Company name</Form.Label>
                            <Form.Control
                                name='companyName'
                                placeholder='Enter company Name'
                                value={link.companyName}
                                onChange={e => handleLinkChange(index, e)}
                                required
                            />
                        </Form.Group>
                    </Row>

                    <Row xs={1} md={2} className='align-items-end'>
                        <Form.Group as={Col} className='mb-3' controlId={`formItemName-${index}`}>
                            <Form.Label>Item</Form.Label>
                            <Form.Control
                                name='item'
                                placeholder='Enter item name'
                                value={link.item}
                                onChange={e => handleLinkChange(index, e)}
                                required
                            />
                        </Form.Group>

                        <Form.Group as={Col} className='mb-3'>
                            <Form.Label htmlFor={`similarityLevelSelect-${index}`}>
                                Similarity Level
                            </Form.Label>
                            <CustomTooltip tooltipText={similarityLevelOptions}
                                iconClassName={'bi bi-question-square'}
                            />
                            <Form.Select
                                aria-label='Select similarity level'
                                name='similarityLevel'
                                id={`similarityLevelSelect-${index}`}
                                value={link.similarityLevel}
                                onChange={e => handleLinkChange(index, e)}
                                required
                            >
                                <option value='' disabled>
                                    Select similarity level
                                </option>
                                {similarityLevelOptions.map((option, idx) => (
                                    <option key={idx} value={option.label}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                    </Row>

                </Col>
            ))}

            <Col>
                <Button
                    type='button'
                    className='w-100'
                    onClick={addLinkField}>
                    <Icon className='bi bi-plus-square' />Add Another Link
                </Button>
            </Col>

        </Row>
    )
}
