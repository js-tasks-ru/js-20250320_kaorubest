/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    let prev;
    let counter = 1;
    let result = '';
    for (const char of string) {
        if (char === prev) {
            counter++;
        } else {
            counter = 1;
        }
        prev = char;
        if (counter > size) {
            continue;
        }
        result += char;
    }
    return result;
}
