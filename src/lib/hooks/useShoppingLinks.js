import { createLink as makeLink } from '../context/dbhandler';

export const useShoppingLinks = () => {

  const createLink = async (href, brandName, item, userId, similarityLevel) => {

    console.log(href, brandName, item, userId, similarityLevel);

    try {
      const res = await makeLink(href, brandName, item, userId, similarityLevel);

      console.log('Link created successfully:', res);

      return res;
    } catch (error) {
      console.error('Error fetching links:', error);
      return 'Error adding link. Please try again later.'
    }
  }

  return { createLink }
}
