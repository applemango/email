import { getMetaTag } from "../src/dom/dom.js"
import { arrayToFlat } from "../src/utils/arr.js"

export const useEffect = (id, fn, arr = []) => {
    const element = getMetaTag(id)
    const isChanged = () => {
        const values = arrayToFlat(arr).join("").concat(".")
        if(element.innerText != values) {
            element.innerText = values
            fn()
        }
    }
    isChanged()
}