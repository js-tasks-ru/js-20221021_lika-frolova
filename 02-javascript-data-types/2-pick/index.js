/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {

    const result = {}
    const entries = Object.entries(obj).filter(x => fields.includes(x[0]))

    for (const [key, value] of entries) {
        result[key] = value
    }

    return result
}
