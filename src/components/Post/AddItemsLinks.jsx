import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useShoppingLinks } from '../../lib/hooks/useShoppingLinks';
import { usePosts } from '../../lib/hooks/usePosts';
import { similarityLevelOptions } from '../../lib/data/similarityLevelOptions';
import { CustomTooltip } from '../ToolTip/CustomTooltip';


export const AddItemsLinks = ({ userId, postId, setItemsLinks }) => {

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
                    <CustomTooltip
                        iconClassName={'bi bi-question-square'}
                        tooltipText={similarityLevelOptions}
                    />
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
    )
}
