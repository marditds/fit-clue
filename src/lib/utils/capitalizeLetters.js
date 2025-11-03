export function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalizeAllLetters(str) {
    return str.toUpperCase();
}

export function capitalizeFirstLetterOfEachWord(str) {
    if (!str) return '';
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
