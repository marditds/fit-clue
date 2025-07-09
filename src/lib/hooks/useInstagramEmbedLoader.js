import { useEffect } from 'react';

export const useInstagramEmbedLoader = (posts) => {

    useEffect(() => {
        if (posts.length === 0) {
            return
        };

        const script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        script.onload = () => {
            if (window.instgrm) {
                window.instgrm.Embeds.process();
            }
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [posts]);

}
