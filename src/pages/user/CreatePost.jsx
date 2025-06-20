import { useState, useEffect } from 'react';
import { usePosts } from '../../lib/hooks/usePosts.js';

const CreatePost = () => {
    const { makePost, fetchPosts } = usePosts();

    const [name, setName] = useState('');
    const [photoLink, setPhotoLink] = useState('');
    const [showLinks, setShowLinks] = useState(false);
    const [links, setLinks] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleLinkChange = (index, e) => {
        const { name, value } = e.target;
        const updatedLinks = [...links];
        updatedLinks[index][name] = value;
        setLinks(updatedLinks);
    };

    const addLinkField = () => {
        setLinks([...links, { href: '', companyName: '', item: '' }]);
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
            const filteredLinks = showLinks
                ? links.filter(link => link.href && link.companyName && link.item)
                : [];

            const response = await makePost(name, filteredLinks, photoLink);
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
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label><br />
                <input type="text" value={name} onChange={e => setName(e.target.value)} required />
            </div>

            <div>
                <label>Photo Link:</label><br />
                <textarea value={photoLink} onChange={e => setPhotoLink(e.target.value)} />
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={showLinks}
                        onChange={handleCheckboxChange}
                    />
                    {' '}Add Links
                </label>
            </div>

            {showLinks && (
                <div>
                    <label>Links:</label><br />
                    {links.map((link, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <input
                                name="href"
                                placeholder="Link URL"
                                value={link.href}
                                onChange={e => handleLinkChange(index, e)}
                                required
                            />
                            <input
                                name="companyName"
                                placeholder="Company Name"
                                value={link.companyName}
                                onChange={e => handleLinkChange(index, e)}
                                required
                            />
                            <input
                                name="item"
                                placeholder="Item"
                                value={link.item}
                                onChange={e => handleLinkChange(index, e)}
                                required
                            />
                            <button type="button" onClick={() => removeLinkField(index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={addLinkField}>+ Add Another Link</button>
                </div>
            )}

            <button type="submit">Create Post</button>
        </form>
    );
};

export default CreatePost;