import { Client, Databases, ID, Permission, Role } from 'appwrite';

export const endpointEnv = import.meta.env.VITE_ENDPOINT;
export const projectEnv = import.meta.env.VITE_PROJECT_ID;

const client = new Client()
    .setEndpoint(endpointEnv)
    .setProject(projectEnv);

const databases = new Databases(client);

const dbEnv = import.meta.env.VITE_DATABASE_ID;
const postsCollEnv = import.meta.env.VITE_POSTS_COLLECTION;
const personalitiesCollEnv = import.meta.env.VITE_PERSONALITIES_COLLECTION;
const linksCollEnv = import.meta.env.VITE_LINKS_COLLECTION;

export const makePost = async (name, linksData, embed_code) => {

    console.log({ name, linksData, embed_code });

    try {
        const personality = await createPersonality(name);

        const links = await Promise.all(
            linksData.map(link =>
                createLink(link.href, link.companyName, link.item)
            )
        );

        const res = await databases.createDocument(
            dbEnv,
            postsCollEnv,
            ID.unique(),
            {
                personality,
                links,
                embed_code
            }
        );

        console.log('Post created successfully:', res);

        return res ? res : null;

    } catch (error) {
        console.error('Error creating post:', error);
        return null;
    }
}

export const createPersonality = async (name) => {

    console.log('name in createPersonality:', name);

    try {
        const res = await databases.createDocument(
            dbEnv,
            personalitiesCollEnv,
            ID.unique(),
            {
                name
            }
        )

        console.log('Personality created successfully:', res);

        if (res) {
            return res;
        }

        return null;
    } catch (error) {
        console.error('Error creating personality:', error);

    }
}

export const createLink = async (href, companyName, item) => {
    try {
        const res = await databases.createDocument(
            dbEnv,
            linksCollEnv,
            ID.unique(),
            {
                href,
                companyName,
                item
            }
        )

        console.log('Link created successfully:', res);

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
        const res = await databases.listDocuments(
            dbEnv,
            postsCollEnv
        )
        if (res.total > 0) {
            return res;
        }

        return null;
    } catch (error) {
        console.error('Error fetching posts:', error);

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

        return null;
    } catch (error) {
        console.error('Error fetching links:', error);

    }
}

