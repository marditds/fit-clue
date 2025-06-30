import { useState, useEffect } from 'react';
import { makePost as composePost, fetchPosts as getPosts, fetchTheLatestPosts as getTheLatestPosts, fetchPostById as getPostById, updatePost as update, createReportLink as makeReportLink, createComment as composeComment, fetchCommentsTextByPostId as getCommentsTextByPostId, fetchUsersByIds, createReportComment as makeReportComment } from '../context/dbhandler';
import { useUserContext } from '../context/UserContext';

export const usePosts = () => {

    const { userId } = useUserContext();

    const [comments, setComments] = useState();

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

    const fetchCommentsTextByPostId = async (postId, lastCursor) => {

        console.log({ postId: postId, lastCursor: lastCursor });

        try {
            const res = await getCommentsTextByPostId(postId, lastCursor);
            console.log('fetchCommentsTextByPostId;', res);

            return res;
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }

    const fetchComments = async (postId, lastCursor) => {

        console.log({ postId: postId, lastCursor: lastCursor });


        if (!postId) {
            return;
        }

        try {
            const commentsTexts = await fetchCommentsTextByPostId(postId, lastCursor);

            console.log('commentsTexts', commentsTexts);

            if (commentsTexts.length === 0) {
                return;
            }

            const userIds = [...new Set(commentsTexts.map(comment => comment.user_id).filter(Boolean))];

            const [allUsersData] = await Promise.all([
                fetchUsersByIds(userIds)
            ]);

            const userMap = new Map(allUsersData.documents.map(user => [user.$id, user]));

            const fullComments = commentsTexts.map(comment => {

                const user = userMap.get(comment.user_id);

                return {
                    ...comment,
                    username: user?.username || 'Unknown User'
                };
            });

            console.log('fullComments:', fullComments);


            setComments((prevComments) => [...(fullComments || []), ...(prevComments || [])].flat());


            // setComments(prevComments => {
            //     const nonDuplicateComments = fullComments.filter(newComment =>
            //         !prevComments?.some(existingComment => existingComment.$id === newComment.$id)
            //     );
            //     return [...prevComments, ...nonDuplicateComments];
            // })

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

    const createReportLink = async (linkId, reason) => {
        try {
            const reportDoc = await makeReportLink(linkId, reason);

            return reportDoc;
        } catch (error) {
            console.error('Error creating report:', error);
        }
    }

    const createReportComment = async (commentId, reason) => {
        try {
            const reportDoc = await makeReportComment(commentId, reason);

            return reportDoc;
        } catch (error) {
            console.error('Error creating report:', error);
        }
    }

    return { makePost, createComment, fetchPosts, fetchCommentsTextByPostId, fetchTheLatestPosts, fetchPostById, updatePost, createReportLink, fetchComments, comments, setComments, createReportComment }
}
