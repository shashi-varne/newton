export function goBackMap(path) {
    let mapper = {
        '/loan/journey': '/loan/home',
        '/loan/instant-kyc': '/loan/journey',
        '/loan/loan-eligible': '/loan/journey'
    }

    return mapper[path] || false;
}