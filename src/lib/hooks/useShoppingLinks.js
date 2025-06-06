import { fetchLinks as getLinks } from '../context/dbhandler';

export const useShoppingLinks = () => {

  const fetchLinks = async () => {
    try {
      const res = await getLinks();

      console.log(res);

      return res;
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  }

  return { fetchLinks }
}
