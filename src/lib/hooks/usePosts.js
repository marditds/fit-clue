import { useState, useEffect } from 'react';
import { makePost as composePost, fetchPosts as getPosts, fetchPostById as getPostById, updatePost as update } from '../context/dbhandler';

export const usePosts = () => {

    const makePost = async (name, linksData, url) => {
        try {
            const res = await composePost(name, linksData, url);
            return res;
        } catch (error) {
            console.error('Error making post:', error);
        }
    }

    const updatePost = async (docId, newLinkId) => {
        try {
            const res = await update(docId, newLinkId);

            return res;

        } catch (error) {
            console.error('Error updating post:', error);
        }
    }

    const fetchPosts = async () => {
        try {
            const res = await getPosts();
            return res;
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }

    const fetchPostById = async (postId) => {
        try {
            const res = await getPostById(postId);
            return res;
        } catch (error) {
            console.error('Error fetching post by id:', error);
        }
    }

    return { makePost, fetchPosts, fetchPostById, updatePost }
}
