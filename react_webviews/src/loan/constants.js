export function goBackMap(path) {
    let mapper = {
        '/gold/sell': '/gold/landing',
    }

    return mapper[path] || false;
}