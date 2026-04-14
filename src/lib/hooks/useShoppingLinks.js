import { createLink as makeLink } from '../context/dbhandler';
import { assessLinkSafety } from '../context/dbhandler';

export const useShoppingLinks = () => {

  const createLink = async (href, brandName, item, userId, similarityLevel) => {

    console.log(href, brandName, item, userId, similarityLevel);

    try {
      const assessmentRes = await assessLinkSafety(href);

      console.log('assessmentRes:', assessmentRes);

      if (assessmentRes.message !== 'ok') {

        if (assessmentRes.message === 'unsafe') {
          console.log(assessmentRes);
          return 'The link violates our community guidelines.';
        }

        if (assessmentRes.message === 'not_valid_shopping_link') {
          console.log(assessmentRes);
          return 'Not a valid shopping link.';
        }
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
