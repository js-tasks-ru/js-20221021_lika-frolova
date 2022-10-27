/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {

    const result = {}
    const entries = Object.entries(obj).filter(x => !fields.includes(x[0]))

    for (const [key, value] of entries) {
        result[key] = value
    }

    return result
}
