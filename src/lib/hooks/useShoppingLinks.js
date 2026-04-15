import { createLink as makeLink } from '../context/dbhandler';
import { assessLinkSafety } from '../context/dbhandler';

export const useShoppingLinks = () => {

  const createLink = async (href, brandName, item, userId, similarityLevel) => {

    console.log(href, brandName, item, userId, similarityLevel);

    try {
      const assessmentRes = await assessLinkSafety(href);

      console.log('assessmentRes:', assessmentRes);

      const MESSAGE_MAP = {
        unsafe: 'The link violates our community guidelines.',
        not_valid_shopping_link: 'Not a valid shopping link.',
        invalid_url: 'The submitted link is not valid.'
      }

      if (assessmentRes.message !== 'ok') {
        return (MESSAGE_MAP[assessmentRes.message] ||
          'Error adding link. Please try again later.');
      }

      if (!assessmentRes || !assessmentRes.message) {
        console.error('Invalid assessment response:', assessmentRes);
        return 'Error adding link. Please try again later.';
      }

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
