/**
 * 配列を1次元に変換する関数。 `[1, 2, [3, 4]] => [1, 2, 3, 4]`
 * @param {any} arr 
 * @returns 
 */
export const arrayToFlat = (arr) => {
    return arr.reduce((acc, v) => {
        if (Array.isArray(v)) {
            return [...acc, ...arrayToFlat(v)]
        }
        return [...acc, v]
    }, [])
}