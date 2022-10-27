/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {

    const sortType = getSortType(param)
    const sortRule = (a, b) => {
        return sortType * a.localeCompare(b, ["ru", "eng"], {caseFirst: "upper"})
    }

    return arr
            .slice()
            .sort(sortRule)
}

const getSortType = (param) => {
    switch (param) {
        case "asc":
            return 1
        case "desc":
            return -1
        default:
            throw "Передан некорректный тип сортировки!"
    }
}
