import { Client, Databases, ID, Query } from 'appwrite';

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

        if (!personality) {
            console.error('Error getting personality.');
            return;
        }

        // console.log('personality:', personality);
        const links = [];
        if (linksData) {
            await Promise.all(
                linksData.map(link =>
                    createLink(link.href, link.companyName, link.item)
                )
            );
        }

        // console.log('links:', links);

        // console.log({ embed_code, personality_id: personality.$id, links: links.map(link => link.$id) });

        const post = await databases.createDocument(
            dbEnv,
            postsCollEnv,
            ID.unique(),
            {
                embed_code,
                personality_id: personality.$id,
                links: links.map(link => link.$id)
            }
        );

        console.log('Post created successfully:', post);

        return post ? post : null;

    } catch (error) {
        console.error('Error creating post:', error);
        return null;
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

export const createLink = async (href, companyName, item) => {

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
                item
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
        const postsRes = await databases.listDocuments(dbEnv, postsCollEnv);

        if (postsRes.total === 0) return null;

        const posts = postsRes.documents;

        // Gather all personality and link IDs from posts
        const personalityIds = posts.map(p => p.personality_id);
        const linkIds = posts.flatMap(p => p.links);

        // Fetch personalities in one batch
        const personalitiesRes = await fetchPersonalitiesByIds(personalityIds);

        const personalitiesMap = Object.fromEntries(
            personalitiesRes.documents.map(personality => [personality.$id, personality])
        );

        // Fetch links in one batch
        const linksRes = await fetchLinksByIds(linkIds);

        const linksMap = Object.fromEntries(
            linksRes.documents.map(link => [link.$id, link])
        );

        // Combine and return data for each post
        const results = posts.map(post => ({
            post,
            personality: personalitiesMap[post.personality_id] || null,
            links: (post.links || []).map(id => linksMap[id]).filter(Boolean)
        }));

        console.log('results', results);


        return results;

    } catch (error) {
        console.error('Error fetching posts:', error);
        return null;
    }
};


export const fetchLinksByIds = async (linkId) => {

    if (!linkId) {
        return [];
    }

    try {
        const res = await databases.listDocuments(
            dbEnv,
            linksCollEnv,
            [Query.equal('$id', linkId)]
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



