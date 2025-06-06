import { Client, Storage, Account, Databases, ID, Query, Functions } from 'appwrite';

export const endpointEnv = import.meta.env.VITE_ENDPOINT;
export const projectEnv = import.meta.env.VITE_PROJECT_ID;

const client = new Client()
    .setEndpoint(endpointEnv)
    .setProject(projectEnv);

const databases = new Databases(client);

const dbEnv = import.meta.env.VITE_DATABASE_ID;
const linksCollEnv = import.meta.env.VITE_LINKS_COLLECTION;
const postsCollEnv = import.meta.env.VITE_POSTS_COLLECTION;

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

