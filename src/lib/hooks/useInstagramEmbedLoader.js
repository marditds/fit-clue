import { useEffect } from 'react';

export const useInstagramEmbedLoader = (posts) => {

    useEffect(() => {
        if (!window.instgrm) {
            const script = document.createElement('script');
            script.src = 'https://www.instagram.com/embed.js';
            script.async = true;
            script.onload = () => {
                window.instgrm?.Embeds.process();
            };
            document.body.appendChild(script);
        } else {
            window.instgrm.Embeds.process();
        }
    }, []);

}
