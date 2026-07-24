export const tokenizeProductName = (name) => {
    return name
        .toLocaleLowerCase()
        .split(/\s+/)
        .map(word => word.replace(/[^\p{L}\p{N}]/gu, ''))
        .filter(word => word.length > 0);
};