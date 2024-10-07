import { Router } from "../../hook/useSpa.js"

export const router = new Router()

export const reImportPage = async (href) => {
    await router.replacePage(href)
    const meta = document.querySelector("meta[name=\"loadscript\"]")
    const src = meta.getAttribute("src")
    const module = await import(src)
    const app = module.App
    app.render()
    registerAllMetaTags(() => {
        app.patch()
    })
}

export const registerAllMetaTags = (fn) => {
    return Array.from(document.querySelectorAll("meta[state_id]")).map((meta) => registerMetaTag(meta, fn) )
}

export const registerMetaTag = (meta, fn) => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' || mutation.type === 'childList') {
                fn(mutation);
            }
        });
    });

    observer.observe(meta, {
        attributes: true,
        childList: true,
        /*
         * 多分いらない
         * ```
         * characterData: true,
         * subtree: true
         * ```
         */
    });

    // disconnectとかする用
    return observer;
};