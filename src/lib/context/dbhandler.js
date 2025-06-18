import { Client, Databases, ID, Query, Functions } from 'appwrite';

export const endpointEnv = import.meta.env.VITE_ENDPOINT;
export const projectEnv = import.meta.env.VITE_PROJECT_ID;

const client = new Client()
    .setEndpoint(endpointEnv)
    .setProject(projectEnv);

const databases = new Databases(client);

const functions = new Functions(client);

const dbEnv = import.meta.env.VITE_DATABASE_ID;
const postsCollEnv = import.meta.env.VITE_POSTS_COLLECTION;
const personalitiesCollEnv = import.meta.env.VITE_PERSONALITIES_COLLECTION;
const linksCollEnv = import.meta.env.VITE_LINKS_COLLECTION;


export const makePost = async (name, productLinksData, url) => {

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
                    createLink(link.href, link.companyName, link.item)
                )
            );
        }

        // console.log({ url, personality_id: personality.$id, links: links.map(link => link.$id) });

        const post = await databases.createDocument(
            dbEnv,
            postsCollEnv,
            ID.unique(),
            {
                url,
                personality_id: personality.$id,
                product_links: product_links.map(product_link => product_link.$id)
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
        const postsRes = await databases.listDocuments(
            dbEnv,
            postsCollEnv
        );

        if (postsRes.total === 0) {
            console.log('No posts yet.');
            return null
        };

        const posts = postsRes.documents;

        // All personalities' IDs
        const personalityIds = posts.map(post => post.personality_id);

        // All links' IDs
        const productLinkIds = posts.flatMap(post => post.product_links);

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

        const productLinksMap = {};
        if (productLinksRes.length !== 0) {
            productLinksMap = Object.fromEntries(
                productLinksRes?.documents?.map(productLink => [productLink.$id, productLink])
            );
        }

        // console.log('linksMap', linksMap);

        // Combine and return data for each post
        const results = posts.map(post => ({
            post,
            personality: personalitiesMap[post.personality_id] || null,
            links: (post.product_links || []).map(id => productLinksMap[id]).filter(Boolean)
        }));

        // console.log('results', results);

        return results;

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



