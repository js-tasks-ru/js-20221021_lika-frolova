/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size = null) {
    
    if (!string || size === null) return string

    let preChar = null
    let repeat = null
    let newString = ''

    for (const char of string) {
        if (char == preChar) {
            repeat++
        } else {
            repeat = 1
        }

        if (repeat <= size) {
            newString += char
        } 
        
        preChar = char
    }

    return newString
}
