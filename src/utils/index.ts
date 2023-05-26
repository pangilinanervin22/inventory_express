export function compareObject(first: object, second: object) {
    return JSON.stringify(first) == JSON.stringify(second);
}