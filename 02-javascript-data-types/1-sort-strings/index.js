/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    const sortMultiplier = param === 'desc' ? -1 : 1;
    const newArr = arr.slice();
    return newArr.sort((a, b) => sortMultiplier * a.localeCompare(b, ['ru', 'en'], { caseFirst: 'upper' }))
}
