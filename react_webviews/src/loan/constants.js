export function goBackMap(path) {
    let mapper = {
        '/loan/journey': '/loan/home',
    }

    return mapper[path] || false;
}