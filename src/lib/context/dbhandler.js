import { Client, ID, Query, Functions, Account, TablesDB, Operator } from 'appwrite';
import { dbFunctionKeysProvider } from './keysProvider';
import { ROUTES } from '../../routes/routes';
import { devLog } from '../utils/devLog';

export const endpointEnv = import.meta.env.VITE_ENDPOINT;
export const projectEnv = import.meta.env.VITE_PROJECT_ID;

const client = new Client()
    .setEndpoint(endpointEnv)
    .setProject(projectEnv);

const account = new Account(client);

const tablesDB = new TablesDB(client);

const functions = new Functions(client);

const dbEnv = import.meta.env.VITE_DATABASE_ID;
const usernamesCollEnv = import.meta.env.VITE_USERNAMES_COLLECTION;
const postsCollEnv = import.meta.env.VITE_POSTS_COLLECTION;
const linksCollEnv = import.meta.env.VITE_LINKS_COLLECTION;
const commentsCollEnv = import.meta.env.VITE_COMMENTS_COLLECTION;
const savesCollEnv = import.meta.env.VITE_SAVES_COLLECTION;
const reportsLinksCollEnv = import.meta.env.VITE_REPORTS_LINKS_COLLECTION;
const reportsCommentsCollEnv = import.meta.env.VITE_REPORTS_COMMENTS_COLLECTION;
const reportsPostsCollEnv = import.meta.env.VITE_REPORTS_POSTS_COLLECTION;

const brandLinksCache = new Map();

export const testTbalesDBCreateRow = async () => {
    try {
        const res = await tablesDB.createRow({
            databaseId: dbEnv,
            tableId: reportsPostsCollEnv,
            rowId: ID.unique(),
            data: {
                post_id: '12121212121212121212',
                reason: 'EYEYEYEYE'
            }
        })
        return res;
    } catch (error) {
        console.error('Error creating row:', error);
    }
}

export const createUser = async (email, password, name) => {
    try {
        const user = await account.create(
            {
                userId: ID.unique(),
                email: email,
                password: password,
                name: name
            }
        );

        if (user) {
            devLog('User was created successfully:', user);

            const session = await account.createEmailPasswordSession({
                email: email,
                password: password
            });

            let userInColl = {};

            if (session) {
                userInColl = await createUserInCollection(user.$id, name);
            }
            return userInColl;
        }

        return null;
    } catch (error) {
        console.error('Error creating user:', error);
        if (error.code === 400) {
            if (error.toString().startsWith('AppwriteException: Invalid `email` param:')) {
                return 'Please enter a valid email address.'
            }
            if (error.toString().startsWith('AppwriteException: Invalid `password` param:')) {
                return 'Password must be between 8 and 265 characters long.'
            }
        } else if (error.code === 409) {
            return 'A user with the same email already exists.'
        } else {
            return ('Something went wrong. Please refresh the page, and try again.');
        }
    }
}

export const createUserInCollection = async (userId, username) => {
    try {
        const user = await tablesDB.createRow({
            databaseId: dbEnv,
            tableId: usernamesCollEnv,
            rowId: userId,
            data: {
                username
            }
        })

        if (user) {
            devLog('User in collection created successfully.');
            return user;
        }

        return null;
    } catch (error) {
        console.error('Error creating user in collection:', error);
    }
}

export const updateUsername = async (username) => {
    try {
        const res = await account.updateName({
            name: username
        });

        if (res) {
            devLog('Username updated successfully.');
            return res;
        }
        return null;
    } catch (error) {
        console.error('Error updating username:', error);
    }
}

export const updateUsernameInCollection = async (userId, username) => {
    try {

        const existingUser = await getUserFromCollectionByUsername(username);

        if (existingUser) {
            return 'Username is taken. Your username must be unique.'
        }

        const res = await tablesDB.updateRow({
            databaseId: dbEnv,
            tableId: usernamesCollEnv,
            rowId: userId,
            data: {
                username
            }
        })
        if (res) {
            await updateUsername(username);
            devLog('Username in collection updated successfully.');
            return res;
        }
    } catch (error) {
        console.error('Error updating username in collection:', error);
    }
}

export const getUserPreferences = async () => {
    try {
        const userPreferences = await account.getPrefs();

        devLog('perfs:', userPreferences);

        return userPreferences;

    } catch (error) {
        console.error('Error getting user prferences:', error);
    }
}

export const getUserFromCollectionById = async (userId) => {
    try {
        const user = await tablesDB.getRow({
            databaseId: dbEnv,
            tableId: usernamesCollEnv,
            rowId: userId
        })

        if (user) {
            return user;
        }

        return null;
    } catch (error) {
        console.error('Error getting user from collection:', error);
    }
}

export const getUserFromCollectionByUsername = async (username) => {
    try {
        const userExists = await tablesDB.listRows({
            databaseId: dbEnv,
            tableId: usernamesCollEnv,
            queries: [
                Query.equal('username', username)
            ]
        })

        if (userExists.total > 0) {
            return userExists;
        }

        return null;
    } catch (error) {
        console.error('Error getting user from collection:', error);
    }
}

export const fetchUsersByIds = async (userIds) => {
    try {
        const users = await tablesDB.listRows({
            databaseId: dbEnv,
            tableId: usernamesCollEnv,
            queries: [Query.equal('$id', userIds)]
        })

        if (users) {
            return users;
        }

        return null;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

export const signInUser = async (email, password) => {
    try {
        const user = await account.createEmailPasswordSession({
            email: email,
            password: password
        })

        if (user) {
            devLog('User signed in successfully:', user);
            return user;
        }

        return null;
    } catch (error) {

        console.error('Error signing in user:', error);
        if (error.code === 400) {
            if (error.toString().startsWith('Error signing in user: AppwriteException: Invalid `email` param:')) {
                return 'Please enter a valid email address.'
            }
        } else if (error.code === 401) {
            return 'Invalid credentials. Please check the email and password.';
        } else {
            return 'Something went wrong. Please try again.'
        }
    }
}

export const getUserSession = async () => {
    try {
        const sessionDets = await account.getSession({
            sessionId: 'current',
        });

        devLog('sessionDets:', sessionDets);

        return sessionDets;

    } catch (error) {
        console.error('Error getting session details:', error);
    }
}

export const getUserAccount = async () => {
    try {
        const user = await account.get();

        return user;

    } catch (error) {
        if (error.code === 401) {
            return null;
        }
        console.error('Error getting user account:', error);
        return null;
    }
}

export const updateUserPassword = async (newPassword, oldPassword) => {
    try {
        const res = await account.updatePassword({
            password: newPassword,
            oldPassword: oldPassword
        })

        devLog(res);
        return res;
    } catch (error) {
        console.error('Error updating user password:', error);
        if (error.code === 400) {
            return 'Password must be between 8 and 265 characters long.'
        } else if (error.code === 401) {
            return 'Please check your current passowrd.'
        } else {
            return 'Something went wrong. Please try again later.'
        }
    }
}

export const createPasswordRecoveryEmail = async (email) => {
    try {
        const res = await account.createRecovery({
            email: email,
            url: ROUTES.RESET_PASSWORD
        })
        devLog('Success creating recovery.');

        return res;
    } catch (error) {
        console.error('Error creating password recovery email:', error);
        if (error.code === 400) {
            return 'Invalid email address.';
        } else if (error.code === 404) {
            return 404;
            // return 'No account is associated with this email address. Please check the email or sign up for a new account.';
        } else {
            return 'Error creating password recovery link. Please try again later.'
        }
    }
}

export const updatePasswordFromRecoveryEmail = async (userId, secret, newPassword) => {
    try {
        const result = await account.updateRecovery({
            userId: userId,
            secret: secret,
            password: newPassword
        });

        devLog('Sccess updating passsword via recovery email.');

        return result;

    } catch (error) {
        console.error('Error updating user password via recovery email:', error);
        if (error.code === 400) {
            // return 'Your password must be between 8 and 265 characters.';
            return 400;
        } else if (error.code === 401) {
            // return 'This link has expired. Request a new recovery email.';
            return 401;
        } else {
            return 'Error updating your password. Please try again later.'
        }
    }
}

export const deleteUserSession = async () => {
    try {
        const resRemoveSession = await account.deleteSession({
            sessionId: 'current'
        });

        return { success: resRemoveSession.message === '' }

    } catch (error) {
        console.error('Error removing session:', error);
        return { success: false }
    }
}

export const deleteUserFromCollection = async (userId) => {
    try {
        await tablesDB.deleteRow({
            databaseId: dbEnv,
            tableId: usernamesCollEnv,
            rowId: userId,
        });
        return 'User successfully deleted from the collection.';
    } catch (error) {
        console.error('Error deleting user form collection:', error);
    }
};

export const makePost = async (personalityName, productLinksData, instaUrl, userId, user_note) => {
    try {
        const duplicateInstaUrl = await tablesDB.listRows({
            databaseId: dbEnv,
            tableId: postsCollEnv,
            queries: [Query.equal('url', instaUrl)]
        });

        if (duplicateInstaUrl.total > 0) {
            return { isDuplicate: true, postId: duplicateInstaUrl.rows[0].$id };
        }

        var product_links = [];

        if (productLinksData.length > 0) {
            const results = await Promise.allSettled(
                productLinksData.map((link) =>
                    createLink(link.href, link.brandName, link.item, link.similarityLevel)
                )
            );

            product_links = results.filter(result => result.status === 'fulfilled' && result.value?.message === 'ok').map(result => result.value);
        }

        const post = await tablesDB.createRow({
            databaseId: dbEnv,
            tableId: postsCollEnv,
            rowId: ID.unique(),
            data: {
                url: instaUrl,
                product_links: product_links.map(product_link => product_link.$id),
                product_names: product_links.map(product_link => product_link.item),
                user_id: userId,
                personality_name: personalityName,
                user_note: user_note
            }
        });
        return post ? post : null;

    } catch (error) {
        console.error('Error creating post:', error);
        return null;
    }
}

export const updatePost = async (docId, newLinkId, newProductName) => {
    try {

        const doc = await tablesDB.getRow({
            databaseId: dbEnv,
            tableId: postsCollEnv,
            rowId: docId
        });

        const existingLinks = doc.product_links || [];
        const existingProducts = doc.product_names || [];

        const updatedLinks = [...existingLinks, newLinkId];

        const updatedProducts = [...existingProducts, newProductName]

        const res = await tablesDB.updateRow({
            databaseId: dbEnv,
            tableId: postsCollEnv,
            rowId: docId,
            data: {
                product_links: updatedLinks,
                product_names: updatedProducts
            }
        })

        devLog('Post updated successfully:', res);

        return res;
    } catch (error) {
        console.error('Error updating post:', error);
        return 'Error adding link. Please try again later.';
    }
}

export const updateUserNote = async (docId, oldNote, newNote) => {
    try {
        const res = await tablesDB.updateRow({
            databaseId: dbEnv,
            tableId: postsCollEnv,
            rowId: docId,
            data: {
                user_note: oldNote === null ? Operator.stringConcat(newNote) : Operator.stringReplace(oldNote, newNote)
            }
        })

        devLog('this is updated note:', res);

        if (res) {
            return 'success';
        } else {
            return 'error'
        }

    } catch (error) {
        console.error('Error updating user\'s note:', error);
        return 'error'
    }
}

export const fetchTheLatestPosts = async () => {
    try {
        const postsRes = await tablesDB.listRows({
            databaseId: dbEnv,
            tableId: postsCollEnv,
            queries: [
                Query.orderDesc('$createdAt'),
                Query.limit(3)
            ]
        });

        if (postsRes.total === 0) {
            devLog('No posts yet.');
            return null
        };

        const content = postsRes.rows;

        return content;

    } catch (error) {
        console.error('Error fetching posts:', error);
        return null;
    }
};

export const fetchPostById = async (postId) => {
    try {
        const postRes = await tablesDB.getRow({
            databaseId: dbEnv,
            tableId: postsCollEnv,
            rowId: postId
        });

        if (!postRes) {
            devLog('No posts yet.');
            return null
        };

        const content = postRes;

        // All links' IDs
        const productLinkIds = content.product_links;

        // Fetch links  
        const productLinksRes = await fetchProductLinksByIds(productLinkIds);

        let productLinksMap = {};
        if (productLinksRes.length !== 0) {
            productLinksMap = Object.fromEntries(
                productLinksRes?.rows?.map(productLink => [productLink.$id, productLink])
            );
        }

        // One post
        const result = {
            content,
            links: (content.product_links || []).map(id => productLinksMap[id]).filter(Boolean)
        };

        return result;

    } catch (error) {
        console.error('Error fetching posts:', error);
        return null;
    }
};

export const fetchInstaPostById = async (postId) => {
    try {
        const postRes = await tablesDB.getRow({
            databaseId: dbEnv,
            tableId: postsCollEnv,
            rowId: postId
        });

        if (!postRes) {
            devLog('No posts yet.');
            return null
        };

        return postRes;

    } catch (error) {
        console.error('Error fetching insta post:', error);
        return null;
    }
};

export const fetchPostsByPersonalityId = async (personalityId) => {
    try {

        const postsByPersonalityId = await tablesDB.listRows({
            databaseId: dbEnv,
            tableId: postsCollEnv,
            queries: [
                Query.equal('personality_id', personalityId),
                Query.orderDesc('$createdAt'),
                Query.limit(3)
            ]
        })

        const content = postsByPersonalityId.rows;

        return content;

    } catch (error) {
        console.error('Error fetching posts by personality id:', error);
    }
}

export const fetchPostsByString = async (str, searchResultLoadLimit, lastCursor = null) => {

    devLog({ personality_name: str });

    try {
        const queries = [
            Query.contains('personality_name', str),
            Query.orderDesc('$createdAt'),
            Query.limit(searchResultLoadLimit)
        ];

        if (lastCursor) {
            queries.push(Query.cursorAfter(lastCursor));
        };

        const postsByStr = await tablesDB.listRows({
            databaseId: dbEnv,
            tableId: postsCollEnv,
            queries: queries
        });

        return postsByStr;

    } catch (error) {
        console.error('Error fetching posts by personality id:', error);
    }
}

export const fetchPostsByCreatorId = async (userId, myPostsLoadLimit, lastCursor = null) => {

    devLog({ userId: userId });

    try {
        const queries = [
            Query.equal('user_id', userId),
            Query.orderDesc('$createdAt'),
            Query.limit(myPostsLoadLimit)
        ];

        if (lastCursor) {
            queries.push(Query.cursorAfter(lastCursor));
        };

        const postsByCreatorId = await tablesDB.listRows({
            databaseId: dbEnv,
            tableId: postsCollEnv,
            queries: queries,
            ttl: 120
        });

        devLog('postsByCreatorId:', postsByCreatorId);

        if (postsByCreatorId.total > 0) {
            return postsByCreatorId;
        }
        return { total: 0, rows: [] };
    } catch (error) {
        console.error('dbhandler - Error fetching posts by creator id', error);
    }
}

export const fetchPostsByItemName = async (itemName, searchResultLoadLimit, lastCursor = null) => {

    devLog('itemName:', itemName);

    try {
        const queries = [
            Query.contains('product_names', [itemName]),
            Query.orderDesc('$createdAt'),
            Query.limit(searchResultLoadLimit)
        ];

        if (lastCursor) {
            queries.push(Query.cursorAfter(lastCursor));
        };

        const postsByItemName = await tablesDB.listRows({
            databaseId: dbEnv,
            tableId: postsCollEnv,
            queries: queries
        });

        devLog('postsByItemName:', postsByItemName);


        return postsByItemName;

    } catch (error) {
        console.error('Error fetching posts by item name:', error);
    }
}

export const fetchPostsByBrandName = async (brandName, searchResultLoadLimit, lastCursor = null) => {

    try {
        let linksIds = brandLinksCache.get(brandName);

        if (!linksIds) {

            devLog('NEW LOOK-UP');

            const queries = [
                Query.contains('brand_name', brandName),
                Query.orderDesc('$createdAt'),
            ];

            const linksByBrandName = await tablesDB.listRows({
                databaseId: dbEnv,
                tableId: linksCollEnv,
                queries: queries,
                total: false
            });

            linksIds = linksByBrandName.rows.map((link) => link.$id);

            brandLinksCache.set(brandName, linksIds);
        }

        // no matching strings with brand names
        if (!linksIds.length) {
            return { rows: [], total: 0 };
        }

        // look up for link ids in post table
        const postQueries = [
            Query.contains('product_links', linksIds),
            Query.orderDesc('$createdAt'),
            Query.limit(searchResultLoadLimit)
        ];

        if (lastCursor) {
            postQueries.push(Query.cursorAfter(lastCursor));
        };

        const postsByBrandName = await tablesDB.listRows({
            databaseId: dbEnv,
            tableId: postsCollEnv,
            queries: postQueries,
        });

        return { ...postsByBrandName, linksIds };

    } catch (error) {
        console.error('Error fetching posts by brand name:', error);
    }
}

export const createPostReport = async (postId, reason) => {
    try {
        const reportDoc = await tablesDB.createRow({
            databaseId: dbEnv,
            tableId: reportsPostsCollEnv,
            rowId: ID.unique(),
            data: {
                post_id: postId,
                reason
            }
        })

        if (reportDoc) {
            devLog('Post report created successfully.');
            return reportDoc;
        }
        return null;
    } catch (error) {
        console.error('Error creating post report:', error);
    }
}

// Saves 
export const createSave = async (postId, userId) => {
    try {
        const saveRes = await tablesDB.createRow({
            databaseId: dbEnv,
            tableId: savesCollEnv,
            rowId: ID.unique(),
            data: {
                post_id: postId,
                user_id: userId
            }
        })

        if (saveRes) {
            return saveRes;
        }

        return null;
    } catch (error) {
        console.error('Error creating save:', error);
    }
}

export const fetchSavesByPostId = async (postId) => {
    try {
        const savesByPostId = await tablesDB.listRows({
            databaseId: dbEnv,
            tableId: savesCollEnv,
            queries: [
                Query.equal('post_id', postId),
                Query.limit(1)
            ],
        });

        if (savesByPostId.total > 0) {
            devLog('savesByPostId:', savesByPostId);
            return savesByPostId.total;
        }

        return null;
    } catch (error) {
        console.error('Error fetching saves by post id:', error);
    }
}

export const fetchSavesByUserId = async (userId, userSavesLoadLimit, lastCursor = null) => {
    try {
        const queries = [
            Query.equal('user_id', userId),
            Query.orderDesc('$createdAt'),
            Query.limit(userSavesLoadLimit)
        ];

        if (lastCursor) {
            queries.push(Query.cursorAfter(lastCursor));
        };

        const savesByUserId = await tablesDB.listRows({
            databaseId: dbEnv,
            tableId: savesCollEnv,
            queries: queries
        });

        if (savesByUserId.total > 0) {
            return savesByUserId;
        }

        return null;
    } catch (error) {
        console.error('Error fetching saves by user id:', error);
    }
}

export const fetchUserSaveForPost = async (postId, userId) => {
    try {
        const userSaveForPost = await tablesDB.listRows({
            databaseId: dbEnv,
            tableId: savesCollEnv,
            queries: [Query.and(
                [
                    Query.equal('post_id', postId),
                    Query.equal('user_id', userId)
                ]
            )
            ],
        });

        if (userSaveForPost.total > 0) {
            devLog('userSaveForPost:', userSaveForPost);
            return userSaveForPost;
        }

        return null;
    } catch (error) {
        console.error('Error fetching saves by user for this post:', error);
    }
}

export const deleteSave = async (docId) => {
    try {
        await tablesDB.deleteRow({
            databaseId: dbEnv,
            tableId: savesCollEnv,
            rowId: docId
        })
    } catch (error) {
        console.error('Error deleting save:', error);
    }
}

// Links
export const createLink = async (href, brandName, item, similarityLevel) => {

    devLog({ href, brandName, item, similarityLevel });

    if (!href) {
        devLog('no href');
        return;
    }
    try {
        const res = await assessLinkSafety(href, brandName, item, similarityLevel);

        if (res) {
            devLog(res);
            return res;
        }
        return null;
    } catch (error) {
        console.error('Error creating link:', error);
        return 'Error adding link. Please try again later.';
    }
}

export const createReportLink = async (linkId, reason) => {
    try {
        const reportDoc = await tablesDB.createRow({
            databaseId: dbEnv,
            tableId: reportsLinksCollEnv,
            rowId: ID.unique(),
            data: {
                link_id: linkId,
                reason
            }
        })

        if (reportDoc) {
            devLog('Link report created successfully.');
            return reportDoc;
        }
        return null;
    } catch (error) {
        console.error('Error creating link report:', error);
    }
}

export const fetchProductLinksByIds = async (productLinkId) => {

    if (productLinkId.length === 0) {
        return [];
    }

    try {
        const res = await tablesDB.listRows({
            databaseId: dbEnv,
            tableId: linksCollEnv,
            queries: [Query.equal('$id', productLinkId)],
            total: false
        })

        if (res.rows.length > 0) {
            return res;
        }

        return [];
    } catch (error) {
        console.error('Error fetching links:', error);
    }
}

// Comments 
export const createReportComment = async (commentId, reason) => {
    try {
        const reportDoc = await tablesDB.createRow({
            databaseId: dbEnv,
            tableId: reportsCommentsCollEnv,
            rowId: ID.unique(),
            data: {
                comment_id: commentId,
                reason
            }
        })

        if (reportDoc) {
            devLog('Comment report created successfully.');
            return reportDoc;
        }
        return null;
    } catch (error) {
        console.error('Error creating report:', error);
    }
}

export const createComment = async (postId, commentText, userId) => {

    devLog({ postId, commentText, userId });

    if (!postId) {
        devLog('no post id');
        return;
    }

    try {
        const doc = await assessCommentSafety(postId, commentText, userId);

        if (doc) {
            devLog('Comment created successfully:', doc);
            return doc;
        }
        return null;
    } catch (error) {
        console.error('Error creating comment:', error);
        return 'Something went wrong. Please try again later.'
    }
}

export const fetchCommentsTextByPostId = async (postId, commentsLoadLimit, lastCursor = null) => {
    try {
        const queries = [
            Query.equal('post_id', postId),
            Query.limit(commentsLoadLimit),
            Query.orderDesc('$createdAt')
        ];

        if (lastCursor) {
            queries.push(Query.cursorAfter(lastCursor));
        }

        const doc = await tablesDB.listRows({
            databaseId: dbEnv,
            tableId: commentsCollEnv,
            queries: queries
        })

        if (doc.total > 0) {
            devLog('Comments fetched successfully:', doc);
            return doc;
        }

        if (doc.total === 0) {
            return [];
        }

        return null;
    } catch (error) {
        console.error('Error fetching comment:', error);
    }
}

// Server-side functions
export const reCaptchaVerification = async (token) => {
    try {
        const recaptcha_function_id = await dbFunctionKeysProvider('recaptcha_function');

        if (!recaptcha_function_id) {
            throw new Error('Failed to load function ID');
        }

        const payload = JSON.stringify({ token });

        const res = await functions.createExecution({
            functionId: recaptcha_function_id,
            body: payload
        })

        if (res.status === 'completed') {
            try {
                const result = JSON.parse(res.responseBody);
                devLog(result);
                return result;
            } catch (parseError) {
                console.error('Error parsing response:', parseError);
                return false;
            }
        } else {
            console.error("Failed to complete reCaptcha verification process.");
        }

    } catch (error) {
        console.error('Error running reCaptcha verification process:', error);
    }
}

export const assessLinkSafety = async (href, brandName, item, similarityLevel) => {
    try {
        const scanlink_function_id = await dbFunctionKeysProvider('scanLink_function');

        if (!scanlink_function_id) {
            throw new Error('Failed to load function ID');
        }

        const payload = JSON.stringify({ href, brandName, item, similarityLevel });

        const res = await functions.createExecution({
            functionId: scanlink_function_id,
            body: payload
        })

        if (res.status === 'completed') {
            try {
                const result = JSON.parse(res.responseBody);
                return result;
            } catch (parseError) {
                console.error('Error parsing response:', parseError);
                return false;
            }
        } else {
            console.error("Failed to complete comment assessment.");
        }

    } catch (error) {
        devLog('Error assessing comment with Gemini:', error);
    }
}

export const assessCommentSafety = async (postId, commentText) => {
    try {
        const comments_function_id = await dbFunctionKeysProvider('comments_function');

        if (!comments_function_id) {
            throw new Error('Failed to load function ID');
        }

        const payload = JSON.stringify({ postId, commentText });

        const res = await functions.createExecution({
            functionId: comments_function_id,
            body: payload
        })

        if (res.status === 'completed') {
            try {
                const result = JSON.parse(res.responseBody);
                return result;
            } catch (parseError) {
                console.error('Error parsing response:', parseError);
                return false;
            }
        } else {
            console.error("Failed to complete comment assessment.");
        }

    } catch (error) {
        devLog('Error assessing comment with Gemini:', error);
    }
}

export const deleteUserFromPlatform = async () => {
    try {
        const user = await account.get();

        const payload = JSON.stringify({ user_id: user.$id });

        const delete_function_id = await dbFunctionKeysProvider('user_delete_function');

        const res = await functions.createExecution({
            functionId: delete_function_id,
            body: payload
        });

        if (res.status === 'completed') {
            const response = JSON.parse(res.responseBody);
            return response;
        } else {
            console.error('Function execution failed:', res);
            return false;
        }
    } catch (err) {
        console.error('Error in deleteUserFromPlatform:', err);
        return false;
    }
};