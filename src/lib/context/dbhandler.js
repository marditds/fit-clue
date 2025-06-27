import { Client, Databases, ID, Query, Functions, Account } from 'appwrite';

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
const reportsPostsCollEnv = import.meta.env.VITE_REPORTS_POSTS_COLLECTION;
const reportsCommentsCollEnv = import.meta.env.VITE_REPORTS_COMMENTS_COLLECTION;

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
                userInColl = await createUserInCollection(name);

                await account.updatePrefs({
                    profile_id: userInColl.$id,
                });
            }

            return userInColl;
        }

        return null;
    } catch (error) {

        console.error('Error creating user:', error);

        if (error.code === 409) {
            return 'A user with the same email already exists.'
        } else {
            return ('Something went wrong. Please refresh the page, and try again.');
        }
    }
}

export const createUserInCollection = async (username) => {
    try {
        const user = await databases.createDocument(
            dbEnv,
            usernamesCollEnv,
            ID.unique(),
            {
                username
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
            return 'Please check your old passowrd.'
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

export const makePost = async (name, productLinksData, url, userId) => {

    console.log({ name, productLinksData, url });

    try {
        const personality = await createPersonality(name);

        if (!personality) {
            console.error('Error getting personality.');
            return;
        }

        // console.log('personality:', personality);
        var product_links = [];
        if (productLinksData.length > 0) {
            product_links = await Promise.all(
                productLinksData.map(link =>
                    createLink(link.href, link.companyName, link.item, userId, link.similarityLevel)
                )
            );
        }

        console.log();


        // console.log({ url, personality_id: personality.$id, links: links.map(link => link.$id) });

        const post = await databases.createDocument(
            dbEnv,
            postsCollEnv,
            ID.unique(),
            {
                url,
                personality_id: personality.$id,
                product_links: product_links.map(product_link => product_link.$id),
                user_id: userId
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

export const createPersonality = async (name) => {

    try {
        const personality = await databases.listDocuments(
            dbEnv,
            personalitiesCollEnv,
            [Query.equal('name', name)]
        )

        if (personality.total > 0) {
            return personality.documents[0];
        }

        const res = await databases.createDocument(
            dbEnv,
            personalitiesCollEnv,
            ID.unique(),
            {
                name
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

export const fetchPosts = async () => {
    try {
        const postsRes = await databases.listDocuments(
            dbEnv,
            postsCollEnv
        );

        if (postsRes.total === 0) {
            console.log('No posts yet.');
            return null
        };

        const contents = postsRes.documents;

        // All personalities' IDs
        const personalityIds = contents.map(post => post.personality_id);

        // All links' IDs
        const productLinkIds = contents.flatMap(post => post.product_links);

        console.log('productLinkIds in fetchPost:', productLinkIds);

        // Fetch personalities
        const personalitiesRes = await fetchPersonalitiesByIds(personalityIds);

        const personalitiesMap = Object.fromEntries(
            personalitiesRes.documents.map(personality => [personality.$id, personality])
        );

        // console.log('personalitiesMap', personalitiesMap);

        // Fetch links  
        const productLinksRes = await fetchProductLinksByIds(productLinkIds);

        console.log('productLinksRes in fetchPosts:', productLinksRes);

        let productLinksMap = {};
        if (productLinksRes.length !== 0) {
            productLinksMap = Object.fromEntries(
                productLinksRes?.documents?.map(productLink => [productLink.$id, productLink])
            );
        }

        // All posts
        const results = contents.map(content => ({
            content,
            personality: personalitiesMap[content.personality_id] || null,
            links: (content.product_links || []).map(id => productLinksMap[id]).filter(Boolean)
        }));

        // console.log('results', results);

        return results;

    } catch (error) {
        console.error('Error fetching posts:', error);
        return null;
    }
};

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

        const contents = postsRes.documents;

        // All personalities' IDs
        const personalityIds = contents.map(post => post.personality_id);

        // All links' IDs
        const productLinkIds = contents.flatMap(post => post.product_links);

        console.log('productLinkIds in fetchPost:', productLinkIds);

        // Fetch personalities
        const personalitiesRes = await fetchPersonalitiesByIds(personalityIds);

        const personalitiesMap = Object.fromEntries(
            personalitiesRes.documents.map(personality => [personality.$id, personality])
        );

        // console.log('personalitiesMap', personalitiesMap);

        // Fetch links  
        const productLinksRes = await fetchProductLinksByIds(productLinkIds);

        console.log('productLinksRes in fetchPosts:', productLinksRes);

        let productLinksMap = {};
        if (productLinksRes.length !== 0) {
            productLinksMap = Object.fromEntries(
                productLinksRes?.documents?.map(productLink => [productLink.$id, productLink])
            );
        }

        // All posts
        const results = contents.map(content => ({
            content,
            personality: personalitiesMap[content.personality_id] || null,
            links: (content.product_links || []).map(id => productLinksMap[id]).filter(Boolean)
        }));

        // console.log('results', results);

        return results;

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

        // console.log('post in fetchPostById:', post);

        // Personality's ID
        const personalityId = content.personality_id;

        // console.log('personalityId in fetchPostById:', personalityId);

        // All links' IDs
        const productLinkIds = content.product_links;

        // console.log('productLinkIds in fetchPostById:', productLinkIds);

        // Fetch one personality
        const personalityRes = await fetchPersonalityById(personalityId);

        // console.log('personalitiesRes', personalityRes);

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
            personality: personalityRes || null,
            links: (content.product_links || []).map(id => productLinksMap[id]).filter(Boolean)
        };

        console.log('result in fetchPostById:', result);

        return result;

    } catch (error) {
        console.error('Error fetching posts:', error);
        return null;
    }
};

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

export const createReportPost = async (linkId, reason) => {
    try {
        const reportDoc = await databases.createDocument(
            dbEnv,
            reportsPostsCollEnv,
            ID.unique(),
            {
                link_id: linkId,
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

export const createReportComment = async (commentId, userId) => {
    try {
        const reportDoc = await databases.createDocument(
            dbEnv,
            reportsCommentsCollEnv,
            ID.unique(),
            {
                comment_id: commentId,
                user_id: userId
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
    }
}

export const fetchCommentsTextByPostId = async (postId) => {
    try {
        const doc = await databases.listDocuments(
            dbEnv,
            commentsCollEnv,
            [
                Query.equal('post_id', postId),
                Query.orderDesc('$createdAt')
            ]
        )

        if (doc.total > 0) {
            console.log('Comments fetched successfully:', doc.documents);
            return doc.documents;
        }
        if (doc.total === 0) {
            return [];
        }

        return null;
    } catch (error) {
        console.error('Error fetching comment:', error);
    }
}