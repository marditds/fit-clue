import { Client, Databases, ID, Query, Functions, Account } from 'appwrite';
import { dbFunctionKeysProvider } from './keysProvider';

export const endpointEnv = import.meta.env.VITE_ENDPOINT;
export const projectEnv = import.meta.env.VITE_PROJECT_ID;

const client = new Client()
    .setEndpoint(endpointEnv)
    .setProject(projectEnv);

const account = new Account(client);

const databases = new Databases(client);

const functions = new Functions(client);

const dbEnv = import.meta.env.VITE_DATABASE_ID;
const usernamesCollEnv = import.meta.env.VITE_USERNAMES_COLLECTION;
const postsCollEnv = import.meta.env.VITE_POSTS_COLLECTION;
const personalitiesCollEnv = import.meta.env.VITE_PERSONALITIES_COLLECTION;
const linksCollEnv = import.meta.env.VITE_LINKS_COLLECTION;
const commentsCollEnv = import.meta.env.VITE_COMMENTS_COLLECTION;
const savesCollEnv = import.meta.env.VITE_SAVES_COLLECTION;
const reportsLinksCollEnv = import.meta.env.VITE_REPORTS_LINKS_COLLECTION;
const reportsCommentsCollEnv = import.meta.env.VITE_REPORTS_COMMENTS_COLLECTION;
const reportsPostsCollEnv = import.meta.env.VITE_REPORTS_POSTS_COLLECTION;

export const createUser = async (email, password, name) => {
    try {
        const user = await account.create(
            ID.unique(),
            email,
            password,
            name
        );

        if (user) {
            console.log('User was created successfully:', user);

            const session = await account.createEmailPasswordSession(email, password);

            let userInColl = {};

            if (session) {
                userInColl = await createUserInCollection(name, email);

                await account.updatePrefs({
                    profile_id: userInColl.$id,
                });
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

export const createUserInCollection = async (username, email) => {
    try {
        const user = await databases.createDocument(
            dbEnv,
            usernamesCollEnv,
            ID.unique(),
            {
                username,
                email
            }
        )

        if (user) {
            console.log('User in collection created successfully.');
            return user;
        }

        return null;
    } catch (error) {
        console.error('Error creating user in collection:', error);
    }
}

export const updateUsername = async (username) => {
    try {
        const res = await account.updateName(username);

        if (res) {
            console.log('Username updated successfully.');
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

        const res = await databases.updateDocument(
            dbEnv,
            usernamesCollEnv,
            userId,
            {
                username
            }
        )
        if (res) {
            await updateUsername(username);
            console.log('Username in collection updated successfully.');
            return res;
        }
    } catch (error) {
        console.error('Error updating username in collection:', error);
    }
}

export const getUserPreferences = async () => {
    try {
        const userPreferences = await account.getPrefs();

        console.log('perfs:', userPreferences);

        return userPreferences;

    } catch (error) {
        console.error('Error getting user prferences:', error);
    }
}

export const getUserFromCollectionById = async (userId) => {

    console.log('userId in getUserFromCollectionById:', userId);

    try {
        const user = await databases.getDocument(
            dbEnv,
            usernamesCollEnv,
            userId
        )

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
        const userExists = await databases.listDocuments(
            dbEnv,
            usernamesCollEnv,
            [
                Query.equal('username', username)
            ]
        )

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
        const users = await databases.listDocuments(
            dbEnv,
            usernamesCollEnv,
            [Query.equal('$id', userIds)]
        )

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
        const user = await account.createEmailPasswordSession(
            email,
            password
        )

        if (user) {
            console.log('User signed in successfully:', user);
            return user;
        }

        return null;
    } catch (error) {

        console.error('Error signing in user:', error);

        if (error.code === 401) {
            return 'Invalid credentials. Please check the email and password.';
        } else {
            return 'Something went wrong. Please try again.'
        }
    }
}

export const getUserSession = async () => {
    try {
        const sessionDets = await account.getSession('current');

        console.log('sessionDets:', sessionDets);

    } catch (error) {
        console.error('Error getting session details:', error);
    }
}

export const getUserAccount = async () => {
    try {
        const user = await account.get();

        return user;

    } catch (error) {
        console.error('Error getting user account:', error);
    }
}

export const updateUserPassword = async (newPassword, oldPassword) => {
    try {
        const res = await account.updatePassword(
            newPassword,
            oldPassword
        )

        console.log(res);
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
        const res = await account.createRecovery(
            email,
            'http://localhost:5173/reset-password'
        )
        console.log('Success creating recovery.');

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
        const result = await account.updateRecovery(
            userId,
            secret,
            newPassword
        );

        console.log('Sccess updating passsword via recovery email.');

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
        await account.deleteSession('current');
    } catch (error) {
        console.error('Error removing session:', error);
    }
}

export const deleteUserFromCollection = async (userId) => {
    try {
        await databases.deleteDocument(
            dbEnv,
            usernamesCollEnv,
            userId,
        );
        return 'User successfully deleted from the collection.';
    } catch (error) {
        console.error('Error deleting user form collection:', error);
    }
};

export const makePost = async (personalityName, productLinksData, instaUrl, userId) => {

    console.log({ personalityName, productLinksData, instaUrl });

    try {
        const personality = await createPersonality(personalityName);

        if (!personality) {
            console.error('Error getting personality.');
            return;
        }

        var product_links = [];
        if (productLinksData.length > 0) {
            product_links = await Promise.all(
                productLinksData.map(link =>
                    createLink(link.href, link.companyName, link.item, userId, link.similarityLevel)
                )
            );
        }

        // console.log({ url, personality_id: personality.$id, links: links.map(link => link.$id) });

        const post = await databases.createDocument(
            dbEnv,
            postsCollEnv,
            ID.unique(),
            {
                url: instaUrl,
                personality_id: personality.$id,
                product_links: product_links.map(product_link => product_link.$id),
                user_id: userId,
                personality_name: personalityName
            }
        );

        console.log('Post created successfully:', post);

        return post ? post : null;

    } catch (error) {
        console.error('Error creating post:', error);
        return null;
    }
}

export const updatePost = async (docId, newLinkId) => {
    try {

        const doc = await databases.getDocument(
            dbEnv,
            postsCollEnv,
            docId
        );

        const existingLinks = doc.product_links || [];

        const updatedLinks = [...existingLinks, newLinkId];

        const res = await databases.updateDocument(
            dbEnv,
            postsCollEnv,
            docId,
            {
                product_links: updatedLinks
            }
        )

        console.log('Post updated successfully:', res);

        return res;
    } catch (error) {
        console.error('Error updating post:', error);
    }
}

export const createPersonality = async (personalityName) => {

    try {
        const personality = await databases.listDocuments(
            dbEnv,
            personalitiesCollEnv,
            [Query.equal('personality_name', personalityName)]
        )

        if (personality.total > 0) {
            return personality.documents[0];
        }

        const res = await databases.createDocument(
            dbEnv,
            personalitiesCollEnv,
            ID.unique(),
            {
                personality_name: personalityName
            }
        )

        if (res) {
            return res;
        }

        return null;
    } catch (error) {
        console.error('Error creating personality:', error);

    }
}

export const fetchTheLatestPosts = async () => {
    try {
        const postsRes = await databases.listDocuments(
            dbEnv,
            postsCollEnv,
            [
                Query.orderDesc('$createdAt'),
                Query.limit(3)
            ]
        );

        if (postsRes.total === 0) {
            console.log('No posts yet.');
            return null
        };

        const content = postsRes.documents;

        return content;

    } catch (error) {
        console.error('Error fetching posts:', error);
        return null;
    }
};

export const fetchPostById = async (postId) => {

    try {
        const postRes = await databases.getDocument(
            dbEnv,
            postsCollEnv,
            postId
        );

        console.log('postRes in fetchPostById:', postRes);

        if (!postRes) {
            console.log('No posts yet.');
            return null
        };

        const content = postRes;

        // All links' IDs
        const productLinkIds = content.product_links;

        // Fetch links  
        const productLinksRes = await fetchProductLinksByIds(productLinkIds);

        // console.log('productLinksRes in fetchPosts:', productLinksRes);

        let productLinksMap = {};
        if (productLinksRes.length !== 0) {
            productLinksMap = Object.fromEntries(
                productLinksRes?.documents?.map(productLink => [productLink.$id, productLink])
            );
        }

        // One post
        const result = {
            content,
            links: (content.product_links || []).map(id => productLinksMap[id]).filter(Boolean)
        };

        console.log('result in fetchPostById:', result);

        return result;

    } catch (error) {
        console.error('Error fetching posts:', error);
        return null;
    }
};

export const fetchInstaPostById = async (postId) => {

    try {
        const postRes = await databases.getDocument(
            dbEnv,
            postsCollEnv,
            postId
        );

        if (!postRes) {
            console.log('No posts yet.');
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

        const postsByPersonalityId = await databases.listDocuments(
            dbEnv,
            postsCollEnv,
            [
                Query.equal('personality_id', personalityId),
                Query.orderDesc('$createdAt'),
                Query.limit(3)
            ]
        )

        const content = postsByPersonalityId.documents;

        // const personality = await fetchPersonalityById(personalityId);

        // Results for one personality
        // const results = content.map(content => ({
        //     content,
        //     personality
        // }));

        console.log(content);

        return content;

    } catch (error) {
        console.error('Error fetching posts by personality id:', error);
    }
}

export const fetchPostsByPersonalityName = async (personalityName) => {
    try {

        const postsByPersonalityName = await databases.listDocuments(
            dbEnv,
            postsCollEnv,
            [
                Query.equal('personality_name', personalityName),
                Query.orderDesc('$createdAt'),
                Query.limit(3)
            ]
        )

        return postsByPersonalityName;

    } catch (error) {
        console.error('Error fetching posts by personality id:', error);
    }
}

export const fetchPostsByString = async (str, searchResultLoadLimit, lastCursor = null) => {
    try {
        const queries = [
            Query.contains('personality_name', str),
            Query.orderDesc('$createdAt'),
            Query.limit(searchResultLoadLimit)
        ];

        if (lastCursor) {
            queries.push(Query.cursorAfter(lastCursor));
        };

        const postsByStr = await databases.listDocuments(
            dbEnv,
            postsCollEnv,
            queries
        );

        return postsByStr;

    } catch (error) {
        console.error('Error fetching posts by personality id:', error);
    }
}

export const fetchPersonalitiesByIds = async (personalityId) => {
    try {
        const res = await databases.listDocuments(
            dbEnv,
            personalitiesCollEnv,
            [Query.equal('$id', personalityId)]
        )
        if (res.total > 0) {
            return res;
        }

        return null;
    } catch (error) {
        console.error('Error fetching links:', error);

    }
}

export const fetchPersonalityById = async (personalityId) => {
    try {
        const res = await databases.getDocument(
            dbEnv,
            personalitiesCollEnv,
            personalityId
        )
        if (res) {
            return res;
        }

        return null;
    } catch (error) {
        console.error('Error fetching links:', error);

    }
}

export const fetchPersonalityByName = async (name) => {
    try {
        const res = await databases.getDocument(
            dbEnv,
            personalitiesCollEnv,
            name
        )
        if (res) {
            return res;
        }

        return null;
    } catch (error) {
        console.error('Error fetching links:', error);

    }
}

export const fetchPersonalities = async () => {
    try {
        const res = await databases.listDocuments(
            dbEnv,
            personalitiesCollEnv
        )
        if (res.total > 0) {
            return res;
        }

        return null;
    } catch (error) {
        console.error('Error fetching links:', error);

    }
}

export const createPostReport = async (postId, reason) => {
    try {
        const reportDoc = await databases.createDocument(
            dbEnv,
            reportsPostsCollEnv,
            ID.unique(),
            {
                post_id: postId,
                reason
            }
        )

        if (reportDoc) {
            console.log('Post report created successfully.');
            return reportDoc;
        }
        return null;
    } catch (error) {
        console.error('Error creating post report:', error);
    }
}

// Links
export const createLink = async (href, companyName, item, userId, similarityLevel) => {

    console.log({ href, companyName, item, userId, similarityLevel });

    if (!href) {
        return;
    }

    try {
        const res = await databases.createDocument(
            dbEnv,
            linksCollEnv,
            ID.unique(),
            {
                href,
                company_name: companyName,
                item,
                user_id: userId,
                similarity_level: similarityLevel
            }
        )

        if (res) {
            return res;
        }

        return null;
    } catch (error) {
        console.error('Error creating link:', error);

    }
}

export const createReportLink = async (linkId, reason) => {
    try {
        const reportDoc = await databases.createDocument(
            dbEnv,
            reportsLinksCollEnv,
            ID.unique(),
            {
                link_id: linkId,
                reason
            }
        )

        if (reportDoc) {
            console.log('Link report created successfully.');
            return reportDoc;
        }
        return null;
    } catch (error) {
        console.error('Error creating link report:', error);
    }
}

export const fetchLinks = async () => {
    try {
        const res = await databases.listDocuments(
            dbEnv,
            linksCollEnv
        )
        if (res.total > 0) {
            return res;
        }

        return [];
    } catch (error) {
        console.error('Error fetching links:', error);

    }
}

export const fetchProductLinksByIds = async (productLinkId) => {

    console.log('linkId in fetchProductLinksByIds:', productLinkId);


    if (productLinkId.length === 0) {
        return [];
    }

    try {
        const res = await databases.listDocuments(
            dbEnv,
            linksCollEnv,
            [Query.equal('$id', productLinkId)]
        )
        if (res.total > 0) {
            return res;
        }

        return [];
    } catch (error) {
        console.error('Error fetching links:', error);
    }
}

// Saves 
export const createSave = async (postId, userId) => {

    console.log({ postId, userId });

    try {
        const saveRes = await databases.createDocument(
            dbEnv,
            savesCollEnv,
            ID.unique(),
            {
                post_id: postId,
                user_id: userId
            }
        )

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
        const savesByPostId = await databases.listDocuments(
            dbEnv,
            savesCollEnv,
            [
                Query.equal('post_id', postId),
                Query.limit(1)
            ],
        );

        if (savesByPostId.total > 0) {
            console.log('savesByPostId:', savesByPostId);
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

        const savesByUserId = await databases.listDocuments(
            dbEnv,
            savesCollEnv,
            queries
        );

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
        const userSaveForPost = await databases.listDocuments(
            dbEnv,
            savesCollEnv,
            [Query.and(
                [
                    Query.equal('post_id', postId),
                    Query.equal('user_id', userId)
                ]
            )
            ],
        );

        if (userSaveForPost.total > 0) {
            console.log('userSaveForPost:', userSaveForPost);
            return userSaveForPost;
        }

        return null;
    } catch (error) {
        console.error('Error fetching saves by user for this post:', error);
    }
}

export const deleteSave = async (docId) => {

    console.log('docId for deleteSave in dbhandler:', docId);

    try {
        await databases.deleteDocument(
            dbEnv,
            savesCollEnv,
            docId
        )
    } catch (error) {
        console.error('Error deleting save:', error);
    }
}

// Comments 
export const createReportComment = async (commentId, reason) => {
    try {
        const reportDoc = await databases.createDocument(
            dbEnv,
            reportsCommentsCollEnv,
            ID.unique(),
            {
                comment_id: commentId,
                reason
            }
        )

        if (reportDoc) {
            console.log('Comment report created successfully.');
            return reportDoc;
        }
        return null;
    } catch (error) {
        console.error('Error creating report:', error);
    }
}

export const createComment = async (postId, commentText, userId) => {
    try {
        const doc = await databases.createDocument(
            dbEnv,
            commentsCollEnv,
            ID.unique(),
            {
                post_id: postId,
                comment_text: commentText,
                user_id: userId
            }
        )

        if (doc) {
            console.log('Comment created successfully:', doc);
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

        const doc = await databases.listDocuments(
            dbEnv,
            commentsCollEnv,
            queries
        )

        if (doc.total > 0) {
            console.log('Comments fetched successfully:', doc);
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

        const res = await functions.createExecution(
            recaptcha_function_id,
            payload
        )

        if (res.status === 'completed') {
            try {
                const result = JSON.parse(res.responseBody);
                console.log(result);
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

export const assessCommentWithGemini = async (commentText) => {

    try {
        const gemini_function_id = await dbFunctionKeysProvider('gemini_function');

        if (!gemini_function_id) {
            throw new Error('Failed to load function ID');
        }

        const payload = JSON.stringify({ commentText });

        const res = await functions.createExecution(
            gemini_function_id,
            payload
        )

        if (res.status === 'completed') {
            try {
                const result = JSON.parse(res.responseBody);
                // console.log(result);
                return result;
            } catch (parseError) {
                console.error('Error parsing response:', parseError);
                return false;
            }
        } else {
            console.error("Failed to complete comment assessment.");
        }

    } catch (error) {
        console.log('Error assessing comment with Gemini:', error);
    }
}

export const deleteUserFromPlatform = async () => {
    try {
        const user = await account.get();

        const payload = JSON.stringify({ $id: user.$id });

        const delete_function_id = await dbFunctionKeysProvider('user_delete_function');

        const res = await functions.createExecution(
            delete_function_id,
            payload
        );

        if (res.status === 'completed') {
            const response = JSON.parse(res.responseBody);
            console.log('Deletion result:', response);
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