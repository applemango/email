import { Router } from "../../hook/useSpa.js"

export const router = new Router()

export const reImportPage = async (href) => {
    await router.replacePage(href)
    const meta = document.querySelector("meta[name=\"loadscript\"]")
    const src = meta.getAttribute("src")
    const module = await import(src)
    const app = module.App
    app.render()
    Array.from(document.querySelectorAll("meta[state_id]")).map((meta) => meta.addEventListener("DOMSubtreeModified", () => {
        app.patch()
    }))
}