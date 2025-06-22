import { useState, useEffect } from 'react';
import { makePost as composePost, fetchPosts as getPosts, fetchTheLatestPosts as getTheLatestPosts, fetchPostById as getPostById, updatePost as update, createReport as makeReport } from '../context/dbhandler';
import { useUserContext } from '../context/UserContext';


export const usePosts = () => {

    const { userId } = useUserContext();

    useEffect(() => {
        console.log('user id in usePosts.jsx:', userId);
    }, [userId])

    const makePost = async (name, linksData, url) => {
        try {
            const res = await composePost(name, linksData, url, userId);
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

    const fetchTheLatestPosts = async () => {
        try {
            const res = await getTheLatestPosts();
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

    const createReport = async (linkId, reason) => {
        try {
            const reportDoc = await makeReport(linkId, reason);

            return reportDoc;
        } catch (error) {
            console.error('Error creating report:', error);
        }
    }

    return { makePost, fetchPosts, fetchTheLatestPosts, fetchPostById, updatePost, createReport }
}
