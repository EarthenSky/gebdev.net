
function asyncMemoize(fn) {
    let cache = {};
    return async function(...args) {
        let n = args[0];
        if (n in cache) {
            return cache[n];
        } else {
            let result = await fn(n);
            cache[n] = result;
            return result;
        }
    }
}