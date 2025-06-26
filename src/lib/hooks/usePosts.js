import { useState, useEffect } from 'react';
import { makePost as composePost, fetchPosts as getPosts, fetchTheLatestPosts as getTheLatestPosts, fetchPostById as getPostById, updatePost as update, createReportPost as makeReportPost, createComment as composeComment, fetchCommentsByPostId as getCommentsByPostId, fetchUsersByIds } from '../context/dbhandler';
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

    const fetchFullComments = async (postId, setComments) => {

        if (!postId) {
            return;
        }

        try {
            const commentsTexts = await fetchCommentsByPostId(postId);

            console.log('commentsTexts:', commentsTexts);


            const userIds = [...new Set(commentsTexts.map(comment => comment.user_id).filter(Boolean))];
            // const commentIds = comments.map(comment => comment.$id);

            console.log('userIds:', userIds);


            const [allUsersData] = await Promise.all([
                fetchUsersByIds(userIds)
            ]);

            console.log('allUsersData:', allUsersData);


            const userMap = new Map(allUsersData.documents.map(user => [user.$id, user]));

            console.log('userMap:', userMap);

            const fullComments = commentsTexts.map(comment => {
                const user = userMap.get(comment.userId);

                return {
                    ...comment,
                    username: user?.username || 'Unknown User'
                };
            });

            console.log('fullComments:', fullComments);

            setComments(prevComments => {
                const nonDuplicateComments = fullComments.filter(newComment =>
                    !prevComments.some(existingComment => existingComment.$id === newComment.$id)
                );
                return [...prevComments, ...nonDuplicateComments];
            })

        } catch (error) {
            console.error('Error fetching comments by id:', error);
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

    return { makePost, createComment, fetchPosts, fetchCommentsByPostId, fetchTheLatestPosts, fetchPostById, updatePost, createReportPost, fetchFullComments }
}
