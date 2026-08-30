import { useEffect } from 'react';
import {
    loadInstagramEmbedScript,
    processInstagramEmbeds
} from '../utils/instagramEmbed';

export const useInstagramEmbedLoader = (
    dependency = [],
    onInstagramUnavailable
) => {
    useEffect(() => {
        let isReady = true;

        const init = async () => {
            try {
                await loadInstagramEmbedScript();

                if (isReady) {
                    requestAnimationFrame(() => {
                        if (isReady) {
                            processInstagramEmbeds((postId) => {
                                if (isReady) {
                                    onInstagramUnavailable?.(postId);
                                }
                            });
                        }
                    });
                }
            } catch (error) {
                console.error('Failed to load Instagram embed script:', error);
            }
        };

        init();

        return () => {
            isReady = false;
        };
    }, [onInstagramUnavailable, ...dependency]);
};