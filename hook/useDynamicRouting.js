import { Router } from "./useSpa.js"

const router = new Router()

export const useDynamicRouting = () => {
    return {
        go: (href)=> {
            router.replacePage(href)
        }
    }
}