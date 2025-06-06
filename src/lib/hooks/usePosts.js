import { fetchPosts as getPosts } from '../context/dbhandler';

export const usePosts = () => {

    const fetchPosts = async () => {
        try {
            const res = await getPosts();

            // console.log(res);

            return res;
        } catch (error) {
            console.error('Error fetching links:', error);
        }
    }

    return { fetchPosts }
}
