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

const EMBED_CHECK_INTERVAL = 500;
const EMBED_CHECK_TIMEOUT = 8000;

const hasInstagramRendered = (embed) => {
    return Boolean(embed.querySelector('iframe'));
};

const checkEmbed = (embed, onUnavailable) => {
    const startTime = Date.now();

    const check = () => {
        if (!embed.isConnected) {
            return;
        }

        if (hasInstagramRendered(embed)) {
            return;
        }

        if (Date.now() - startTime >= EMBED_CHECK_TIMEOUT) {
            const postId = embed.dataset.fitcluePostId;

            if (postId) {
                onUnavailable(postId);
            }

            return;
        }

        setTimeout(check, EMBED_CHECK_INTERVAL);
    };

    check();
};

export const processInstagramEmbeds = (onUnavailable) => {
    if (!window.instgrm?.Embeds) {
        return;
    }

    const embeds = document.querySelectorAll(
        'blockquote.instagram-media[data-fitclue-post-id]'
    );

    if (!embeds.length) {
        return;
    }

    window.instgrm.Embeds.process();

    embeds.forEach((embed) => {
        checkEmbed(embed, onUnavailable);
    });
};