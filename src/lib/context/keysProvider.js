// for components use only
export const keysProvider = (key, setFunction) => {
    const keyMap = {
        recaptcha: {
            development: "VITE_RECAPTCHA_SITE_KEY",
            staging: "VITE_RECAPTCHA_SITE_KEY",
            production: "VITE_RECAPTCHA_SITE_KEY",
        }
    };

    const mode = import.meta.env.MODE;
    const envVar = keyMap[key]?.[mode];

    if (!envVar) {
        console.warn(`No environment variable configured for key "${key}" in mode "${mode}"`);
        return;
    }

    const value = import.meta.env[envVar];

    if (!value) {
        console.warn(`Environment variable "${envVar}" is not defined`);
        return;
    }

    setFunction(value);

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

