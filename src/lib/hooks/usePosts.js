import { useEffect } from 'react';
import { makePost as composePost, fetchTheLatestPosts as getTheLatestPosts, fetchPostById as getPostById, fetchInstaPostById as getInstaPostById, fetchPostsByPersonalityId as getPostsByPersonalityId, fetchPostsByString as getPostsByString, updatePost as update, updateUserNote as updateNote, createReportLink as makeReportLink, createComment as composeComment, fetchCommentsTextByPostId as getCommentsTextByPostId, fetchPostsByBrandName as getPostsByBrandName, fetchUsersByIds, createReportComment as makeReportComment, createSave as makeSave, fetchSavesByPostId as getSavesByPostId, deleteSave as removeSave, fetchUserSaveForPost as getUserSaveForPost, createPostReport as makePostReport, fetchSavesByUserId as getSavesByUserId, fetchPostsByItemName as getPostsByItemName, fetchPostsByCreatorId as getPostsByCreatorId } from '../context/dbhandler';
import { useUserContext } from '../context/UserContext';

export const usePosts = () => {

    const { userId } = useUserContext();

    const searchResultLoadLimit = 6;

    const commentsLoadLimit = 5;

    const myPostsLoadLimit = 5;

    const userSavesLoadLimit = 5;

    useEffect(() => {
        console.log('user id in usePosts.jsx:', userId);
    }, [userId])

    const makePost = async (name, productLinksData, instaUrl, userId, user_note) => {
        try {
            const res = await composePost(name, productLinksData, instaUrl, userId, user_note);
            return res;
        } catch (error) {
            console.error('Error making post:', error);
            return null;
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

    const updatePost = async (docId, newLinkId, itemName) => {
        try {
            const res = await update(docId, newLinkId, itemName);

            return res;

        } catch (error) {
            console.error('Error updating post:', error);
            return 'Error adding link. Please try again later.'
        }
    }

    const updateUserNote = async (docId, oldNote, newNote) => {
        try {
            const res = await updateNote(docId, oldNote, newNote);
            return res;
        } catch (error) {
            console.error('Erro updating user note:', error);
        }
    }

    const fetchCommentsTextByPostId = async (postId, lastCursor) => {

        console.log({ postId: postId, lastCursor: lastCursor });

        try {
            const cmmnts = await getCommentsTextByPostId(postId, commentsLoadLimit, lastCursor);

            console.log('fetchCommentsTextByPostId;', cmmnts);

            if (cmmnts.length === 0) {
                return [];
            }

            return cmmnts;
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
            const commentsRes = await fetchCommentsTextByPostId(postId, lastCursor);

            if (commentsRes?.length === 0) {
                return [];
            }

            const commentsTexts = commentsRes.rows;
            const commentsTotal = commentsRes.total;

            const userIds = [...new Set(commentsTexts.map(comment => comment.user_id).filter(Boolean))];

            const [allUsersData] = await Promise.all([
                fetchUsersByIds(userIds)
            ]);

            const userMap = new Map(allUsersData.rows.map(user => [user.$id, user]));

            const fullComments = commentsTexts.map(comment => ({
                ...comment,
                username: userMap.get(comment.user_id)?.username || 'Deleted user',
            }));

            return {
                rows: fullComments,
                total: commentsTotal,
            };
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

    const fetchInstaPostById = async (postId) => {
        try {
            const res = await getInstaPostById(postId);
            return res;
        } catch (error) {
            console.error('Error fetching insta post by id:', error);
        }
    }

    const fetchPostsByPersonalityId = async (personalityId) => {
        try {
            const res = await getPostsByPersonalityId(personalityId);
            return res;
        } catch (error) {
            console.error('Error fetching post by id:', error);
        }
    }

    const fetchPostsByString = async (str, lastCursor) => {
        try {
            const res = await getPostsByString(str, searchResultLoadLimit, lastCursor);
            return res;
        } catch (error) {
            console.error('Error fetching post by id:', error);
        }
    }

    const fetchPostsByItemName = async (itemName, lastCursor) => {
        try {
            const res = await getPostsByItemName(itemName, searchResultLoadLimit, lastCursor);
            return res;
        } catch (error) {
            console.error('Error fetching post by id:', error);
        }
    }

    const fetchPostsByBrandName = async (brandName, lastCursor) => {
        try {
            const res = await getPostsByBrandName(brandName, searchResultLoadLimit, lastCursor);
            return res;
        } catch (error) {
            console.error('Error fetching post by brand name:', error);
        }
    }

    const fetchPostsByCreatorId = async (userId, lastCursor) => {
        try {
            const myPosts = await getPostsByCreatorId(userId, myPostsLoadLimit, lastCursor);
            return myPosts;
        } catch (error) {
            console.error('Error fetching my posts:', error);
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

    const createPostReport = async (commentId, reason) => {
        try {
            const reportDoc = await makePostReport(commentId, reason);
            return reportDoc;
        } catch (error) {
            console.error('Error creating report:', error);
        }
    }

    // Save
    const createSave = async (postId, userId) => {
        try {
            const res = await makeSave(postId, userId);
            return res;
        } catch (error) {
            console.error('Error creating save:', error);
        }
    }

    const fetchSavesByPostId = async (postId) => {
        try {
            const savesRes = await getSavesByPostId(postId);
            return savesRes;
        } catch (error) {
            console.error('Error creating save:', error);
        }
    }

    const fetchSavesByUserId = async (userId, lastCursor) => {
        try {
            const savesRes = await getSavesByUserId(userId, userSavesLoadLimit, lastCursor);
            return savesRes;
        } catch (error) {
            console.error('Error creating save:', error);
        }
    }

    const fetchUserSaveForPost = async (postId, userId) => {
        try {
            const userSaveforPost = await getUserSaveForPost(postId, userId);
            return userSaveforPost;
        } catch (error) {
            console.error('Error creating save:', error);
        }
    }

    const deleteSave = async (docId) => {
        try {
            await removeSave(docId);
        } catch (error) {
            console.error('Error deleting save:', error);
        }
    }

    return { makePost, createComment, fetchCommentsTextByPostId, fetchTheLatestPosts, fetchPostById, fetchInstaPostById, fetchPostsByPersonalityId, fetchPostsByString, fetchPostsByBrandName, updatePost, updateUserNote, createReportLink, fetchComments, commentsLoadLimit, createReportComment, searchResultLoadLimit, createSave, fetchSavesByPostId, fetchUserSaveForPost, deleteSave, createPostReport, fetchSavesByUserId, userSavesLoadLimit, fetchPostsByItemName, fetchPostsByCreatorId, myPostsLoadLimit }
}
