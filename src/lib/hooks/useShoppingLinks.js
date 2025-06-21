import { createLink as makeLink } from '../context/dbhandler';

export const useShoppingLinks = () => {

  const createLink = async (href, companyName, item, userId) => {

    console.log(href, companyName, item, userId);

    try {
      const res = await makeLink(href, companyName, item, userId);

      console.log('Link created successfully:', res);

      return res;
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  }

  return { createLink }
}
