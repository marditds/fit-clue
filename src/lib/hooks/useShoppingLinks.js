import { createLink as makeLink } from '../context/dbhandler';
import { assessLinkSafety } from '../context/dbhandler';
import { devError, devLog } from '../utils/devConsole';

export const useShoppingLinks = () => {

  const createLink = async (href, brandName, item, similarityLevel) => {

    devLog({ href, brandName, item, similarityLevel });

    try {
      const MESSAGE_MAP = {
        unsafe: 'The link violates our community guidelines.',
        not_valid_shopping_link: 'Not a valid shopping link.',
        invalid_url: 'The submitted link is not valid.'
      }

      const res = await makeLink(href, brandName, item, similarityLevel);

      if (res.message !== 'ok') {
        return (MESSAGE_MAP[res.message] ||
          'Error adding link. Please try again later.');
      }

      if (!res || !res.message) {
        devError('Invalid assessment response:', res);
        return 'Error adding link. Please try again later.';
      }

      devLog('Link created successfully:', res);

      return res;
    } catch (error) {
      devError('Error fetching links:', error);
      return 'Error adding link. Please try again later.'
    }
  }

  return { createLink }
}
