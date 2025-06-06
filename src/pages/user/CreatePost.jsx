import React, { useState } from 'react';
import { usePosts } from '../../lib/hooks/usePosts.js';

const CreatePost = () => {

    const { makePost } = usePosts();

    const [name, setName] = useState('');
    const [links, setLinks] = useState([{ href: '', companyName: '', item: '' }]);
    const [embedCode, setEmbedCode] = useState('');

    const handleLinkChange = (index, e) => {
        const { name, value } = e.target;
        const updatedLinks = [...links];
        updatedLinks[index][name] = value;
        setLinks(updatedLinks);
    };

    const addLinkField = () => {
        setLinks([...links, { href: '', companyName: '', item: '' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await makePost(name, links, embedCode);
            if (response) {
                console.log('Post created successfully!');
            } else {
                console.error('Post creation failed.');
            }
        } catch (err) {
            console.error(err);
            console.error('Error creating post.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label><br />
                <input type="text" value={name} onChange={e => setName(e.target.value)} required />
            </div>

            <div>
                <label>Embed Code:</label><br />
                <textarea value={embedCode} onChange={e => setEmbedCode(e.target.value)} />
            </div>

            <div>
                <label>Links:</label>
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
                        />
                        <input
                            name="item"
                            placeholder="Item"
                            value={link.item}
                            onChange={e => handleLinkChange(index, e)}
                        />
                    </div>
                ))}
                <button type="button" onClick={addLinkField}>+ Add Another Link</button>
            </div>

            <button type="submit">Create Post</button>
        </form>
    );
};

export default CreatePost;