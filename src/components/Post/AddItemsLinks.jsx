import { useEffect, useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { useShoppingLinks } from '../../lib/hooks/useShoppingLinks';
import { usePosts } from '../../lib/hooks/usePosts';
import { similarityLevelOptions } from '../../lib/data/similarityLevelOptions';
import { CustomTooltip } from '../Accessories/CustomTooltip';
import { Icon } from '../Accessories/Icon';
import { IconHanger, IconMetronome, IconShoppingBag } from '@tabler/icons-react';


export const AddItemsLinks = ({ userId, postId, isLoggedIn, setItemsLinks }) => {

    const { createLink } = useShoppingLinks();

    const { updatePost } = usePosts();

    const [companyName, setCompanyName] = useState('');
    const [itemName, setItemName] = useState('');
    const [href, setHref] = useState('');
    const [similarityLevel, setSimilarityLevel] = useState('');
    const [similarityLevelDesc, setSimilarityLevelDesc] = useState('');
    const [isAddningLink, setIsAddingLink] = useState(false);

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

            const updatedPost = await updatePost(postId, newLink.$id);

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

    return (
        <div>
            <Row className='post__add-link-row mx-auto py-4'>
                <Col>
                    <h3 className='d-flex align-items-center'>
                        {/* <Icon
                            className='bi bi-plus-lg'
                            marginEndSize={'2'}
                        /> */}
                        <IconShoppingBag stroke={1} size={35} className='me-1' />
                        Add Item Link
                    </h3>
                    {
                        !isLoggedIn &&
                        <h4>Please sign in to add links.</h4>
                    }

                    <Form onSubmit={onAddLinkSubmit} style={{ marginBottom: '0px' }}>

                        <Form.Group className='mb-3' controlId='CompanyNameField'>
                            <Form.Label className='d-flex align-items-end'>
                                <Icon className='bi bi-buildings fs-5' marginEndSize='2' />
                                Company name
                            </Form.Label>
                            <Form.Control
                                type='text'
                                value={companyName}
                                disabled={!isLoggedIn}
                                onChange={onCompanyNameCahnge}
                                placeholder='Enter company name' />
                        </Form.Group>

                        <Form.Group className='mb-3' controlId='ItemNameField'>
                            <Form.Label>
                                <IconHanger stroke={1.25} size={27} className='me-2' />
                                Item
                            </Form.Label>
                            <Form.Control
                                type='text'
                                value={itemName}
                                disabled={!isLoggedIn}
                                onChange={onItemNameChange}
                                placeholder='Enter item name' />
                        </Form.Group>

                        <Form.Group className='mb-3' controlId='ItemUrlField'>
                            <Form.Label>
                                <Icon className='bi bi-link-45deg fs-4' marginEndSize='2' />
                                Product Link
                            </Form.Label>
                            <Form.Control
                                type='text'
                                value={href}
                                disabled={!isLoggedIn}
                                onChange={onUrlCahnge}
                                placeholder='https://shop.example.com/product' />
                        </Form.Group>

                        <Form.Group className='mb-3' controlId='similarityLevelDropdownMenu'>

                            <Form.Label className='w-100'>
                                <IconMetronome stroke={1.25} size={28} className='me-2' />
                                Similarity Level:
                                <CustomTooltip
                                    iconClassName='bi bi-question-square'
                                    tooltipText={similarityLevelOptions}
                                />
                            </Form.Label>

                            <Form.Select
                                aria-label='Select similarity level'
                                name='similarityLevel'
                                value={similarityLevel}
                                disabled={!isLoggedIn}
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
                            disabled={!companyName || !itemName || !href || !isLoggedIn}
                            className='mt-1'
                        >
                            {isAddningLink ? 'Adding link...' : 'Add Item Link'}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </div>

    )
}
