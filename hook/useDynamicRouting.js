import { getMetaTag } from "../src/dom/dom.js"
import { reImportPage, router } from "../src/dom/route.js"


export const useDynamicRouting = () => {
    return {
        go: async (href)=> {
            reImportPage(href)
        }
    }
}