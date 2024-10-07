import { registerAllMetaTags, reImportPage } from "./route.js";

(async ()=> {
    const loadScriptMeta = document.querySelector("meta[name=\"loadscript\"]")
    const script = loadScriptMeta.getAttribute("src")

    const loadPageMeta = document.querySelector("meta[name=\"loadpage\"]")
    const page = loadPageMeta.getAttribute("src")

    const module = await import(script)
    const app = module.App
    app.render()

    registerAllMetaTags(() => {
        app.patch()
    })
    /*Array.from(document.querySelectorAll("meta[state_id]")).map((meta) => meta.addEventListener("DOMSubtreeModified", () => {
        app.patch()
    }))*/

    window.addEventListener("popstate", (event)=> {
        reImportPage(page)
    })
})();