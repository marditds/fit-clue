import { useEffect } from 'react';
import { makePost as composePost, fetchPosts as getPosts } from '../context/dbhandler';

export const usePosts = () => {

    useEffect(() => {
        fetchPosts();
    }, [])

    const makePost = async (name, linksData, embed_code) => {
        try {
            const res = await composePost(name, linksData, embed_code);
            return res;
        } catch (error) {
            console.error('Error fetching links:', error);
        }
    }

    const fetchPosts = async () => {
        try {
            const res = await getPosts();
            return res;
        } catch (error) {
            console.error('Error fetching links:', error);
        }
    }

    return { makePost, fetchPosts }
}
