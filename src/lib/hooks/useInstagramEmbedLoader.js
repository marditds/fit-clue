import { useEffect } from 'react';
import { loadInstagramEmbedScript, processInstagramEmbeds } from '../utils/instagramEmbed';

export const useInstagramEmbedLoader = (dependency = []) => {
    useEffect(() => {
        let isReady = true;

        const init = async () => {
            await loadInstagramEmbedScript();

            if (isReady) {
                requestAnimationFrame(() => {
                    processInstagramEmbeds();
                });
            }
        };

        init();

        return () => {
            isReady = false;
        };
    }, dependency);
};