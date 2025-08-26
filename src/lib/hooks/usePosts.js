import { useEffect } from 'react';
import { makePost as composePost, fetchTheLatestPosts as getTheLatestPosts, fetchPostById as getPostById, fetchInstaPostById as getInstaPostById, fetchPostsByPersonalityId as getPostsByPersonalityId, fetchPostsByPersonalityName as getPostsByPersonalityName, fetchPostsByString as getPostsByString, updatePost as update, createReportLink as makeReportLink, createComment as composeComment, fetchCommentsTextByPostId as getCommentsTextByPostId, fetchUsersByIds, createReportComment as makeReportComment, createSave as makeSave, fetchSavesByPostId as getSavesByPostId, deleteSave as removeSave, fetchUserSaveForPost as getUserSaveForPost, createPostReport as makePostReport, fetchSavesByUserId as getSavesByUserId } from '../context/dbhandler';
import { useUserContext } from '../context/UserContext';

export const usePosts = () => {

    const { userId } = useUserContext();

    const searchResultLoadLimit = 6;

    const commentsLoadLimit = 5;

    const userSavesLoadLimit = 5;

    useEffect(() => {
        console.log('user id in usePosts.jsx:', userId);
    }, [userId])

    const makePost = async (name, productLinksData, instaUrl, userId) => {
        try {
            const res = await composePost(name, productLinksData, instaUrl, userId);
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

    const updatePost = async (docId, newLinkId) => {
        try {
            const res = await update(docId, newLinkId);

            return res;

        } catch (error) {
            console.error('Error updating post:', error);
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

            console.log('commentsRes', commentsRes);

            if (commentsRes?.length === 0) {
                return [];
            }

            const commentsTotal = commentsRes.total;
            const commentsTexts = commentsRes.documents;

            console.log('commentsTexts', commentsTexts);

            const userIds = [...new Set(commentsTexts.map(comment => comment.user_id).filter(Boolean))];

            const [allUsersData] = await Promise.all([
                fetchUsersByIds(userIds)
            ]);

            const userMap = new Map(allUsersData.documents.map(user => [user.$id, user]));

            const fullComments = commentsTexts.map(comment => ({
                ...comment,
                username: userMap.get(comment.user_id)?.username || 'Deleted user',
            }));

            console.log('fullComments:', fullComments);

            return {
                documents: fullComments,
                total: commentsTotal,
            };
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

    const fetchPostsByPersonalityName = async (personalityName) => {
        try {
            const res = await getPostsByPersonalityName(personalityName);
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

    return { makePost, createComment, fetchCommentsTextByPostId, fetchTheLatestPosts, fetchPostById, fetchInstaPostById, fetchPostsByPersonalityId, fetchPostsByPersonalityName, fetchPostsByString, updatePost, createReportLink, fetchComments, commentsLoadLimit, createReportComment, searchResultLoadLimit, createSave, fetchSavesByPostId, fetchUserSaveForPost, deleteSave, createPostReport, fetchSavesByUserId, userSavesLoadLimit }
}
