let scriptLoadingPromise = null;

export const loadInstagramEmbedScript = () => {
    if (window.instgrm?.Embeds) {
        return Promise.resolve();
    }

    if (!scriptLoadingPromise) {
        scriptLoadingPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://www.instagram.com/embed.js';
            script.async = true;

            script.onload = () => resolve();
            script.onerror = reject;

            document.body.appendChild(script);
        });
    }

    return scriptLoadingPromise;
};

export const processInstagramEmbeds = () => {
    if (window.instgrm?.Embeds) {
        window.instgrm.Embeds.process();
    }
};