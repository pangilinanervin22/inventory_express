export function compareObject(first: object, second: object) {
    return JSON.stringify(first) == JSON.stringify(second);
}

export function delayTimeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}