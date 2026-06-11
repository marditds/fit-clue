// for components use only
export const keysProvider = (key, setFunction) => {

    const keyMap = {
        recaptcha: {
            dev: "VITE_RECAPTCHA_SITE_KEY",
            prod: "VITE_RECAPTCHA_SITE_KEY",
        },
    };

    const config = keyMap[key];

    if (!config) {
        console.warn(`Unknown key: ${key} `);
        return;
    }

    const envVar = import.meta.env.DEV ? config.dev : config.prod;
    const value = import.meta.env[envVar];

    if (value) {
        setFunction(value);
    }

    fetch(`/.netlify/functions/get-tokens?key=${key}`)
        .then((res) => res.json())
        .then((data) => setFunction(data.value))
        .catch((err) => console.error(`Error fetching ${key} tokens:`, err));

};


// for dbhandler use only
export const dbFunctionKeysProvider = async (key) => {

    if (import.meta.env.DEV) {
        const localKeyMap = {
            user_delete_function: "VITE_USER_DELETE_FUNCTION_ID",
            recaptcha_function: "VITE_RECAPTCHA_FUNCTION_ID",
            gemini_function: "VITE_GEMINI_FUNCTION_ID",
            scanLink_function: "VITE_SCANLINK_FUNCTION_ID"
        };

        const localKey = import.meta.env[localKeyMap[key]];
        if (localKey) {
            return localKey;
        }
    }

    try {
        const res = await fetch(`/.netlify/functions/get-tokens?key=${key}`);
        const data = await res.json();
        return data.value;
    } catch (err) {
        console.error(`Error fetching ${key} token:`, err);
        return null;
    }

};

