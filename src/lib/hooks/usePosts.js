import { useState, useEffect } from 'react';
import { makePost as composePost, fetchPosts as getPosts, fetchTheLatestPosts as getTheLatestPosts, fetchPostById as getPostById, updatePost as update, createReportPost as makeReportPost, createComment as composeComment, fetchCommentsByPostId as getCommentsByPostId } from '../context/dbhandler';
import { useUserContext } from '../context/UserContext';


export const usePosts = () => {

    const { userId } = useUserContext();

    useEffect(() => {
        console.log('user id in usePosts.jsx:', userId);
    }, [userId])

    const makePost = async (name, productLinksData, url, userId) => {
        try {
            const res = await composePost(name, productLinksData, url, userId);
            return res;
        } catch (error) {
            console.error('Error making post:', error);
        }
    }

    const createComment = async (postId, commentText, userId) => {
        try {
            const res = await composeComment(postId, commentText, userId);
            return res;
        } catch (error) {
            console.error('Error making comment:', error);
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

    const fetchCommentsByPostId = async (postId) => {
        try {
            const res = await getCommentsByPostId(postId);
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

    const createReportPost = async (linkId, reason) => {
        try {
            const reportDoc = await makeReportPost(linkId, reason);

            return reportDoc;
        } catch (error) {
            console.error('Error creating report:', error);
        }
    }

    return { makePost, createComment, fetchPosts, fetchCommentsByPostId, fetchTheLatestPosts, fetchPostById, updatePost, createReportPost }
}
