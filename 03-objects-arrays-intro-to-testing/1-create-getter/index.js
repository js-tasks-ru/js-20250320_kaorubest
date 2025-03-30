/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    const propNames = path.split('.');
    const size = propNames.length;
    return (obj) => {
        for (let i=0; i<size; i++) {
            const prop = propNames[i];
            if (prop in obj && Object.hasOwn(obj, prop)) {
                obj = obj[prop];
            } else return undefined
        }
        return obj;
    }
}
