/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    const propNames = path.split('.');
    return (obj) => {
        for (const propName of propNames) {
            if (propName in obj && Object.hasOwn(obj, propName)) {
                obj = obj[propName];
            } else return;
        }
        return obj;
    }
}
