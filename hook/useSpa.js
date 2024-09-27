//@ts-check
import { writeDoc } from "../src/dom/dom.js"

/**
 * @param {string} a
 * @param {string} b
 * @returns boolean
 */
const SomeOrigin = (a, b) => (new URL(a)).origin == (new URL(b)).origin

export class Router {
    constructor() {
        this.pages = {};
    }
    /**
     * @param {string} href
     * @returns string
     */
    async loadPage(href) {
        if(this.pages[href]) {
            return this.pages[href]
        }
        const res = await fetch(href);
        const body = await res.text();
        this.pages[href] = body
        return body
    }
    /**
     * @param {string} href
     */
    async historyPush(href) {
        history.pushState(href, href, href)
    }
    /**
     * @param {string} href
     */
    async replacePage(href) {
        const html = await this.loadPage(href)
        writeDoc(html)
        this.historyPush(href)
    }
    /**
     * @param {Event} e
     * @param {(href: string)=> void} handler
     */
    async onEvent(e, handler) {
        // @ts-ignore
        const eName = e.srcElement.nodeName
        if (eName === "A") {
            //@ts-ignore
            const targetHref = e.srcElement.href
            if (SomeOrigin(targetHref, window.location.href)) {
                handler(targetHref)
            }
        }
    }
    async init() {
        window.addEventListener("mousemove", (e)=> {
            this.onEvent(e, (href)=> {
                this.loadPage(href)
            })
        })
        window.addEventListener("click", (e) => {
            this.onEvent(e, (href)=> {
                e.preventDefault();
                this.replacePage(href)
            })
        })
        window.addEventListener("popstate", (event) => {
            this.replacePage(document.location.href)
        });
    }
}

export const useSpa = () => {
    const router = new Router()
    router.init()
}