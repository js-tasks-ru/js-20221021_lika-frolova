/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {

    return function(obj) {

        let value = obj
        const props = path.split(".")

        for (const prop of props) {
            value = value[prop]
            if (!value) break            
        }

        return value
    }
}
