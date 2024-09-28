import { s } from "../src/dom/style.js";
import { component, h } from "../src/dom/virtualdom.js";


/**
 * @type {typeof component<{}>}
 */
export const HeaderComponent = component
export const Header = HeaderComponent(({}) => {
    
    return h("div", {},
        h("div", {
            style: s({
                borderBottom: "1px solid #eee",
                padding: "8px"
            })
        },
            h("div", {
                style: s({ display: "flex", width: "100%", alignItems: "center", gap: "8px" })
            },
                h("img", {
                    attr: {
                        src: "/public/icon/mailbox.png"
                    },
                    style: s({
                        width: "32px",
                        height: "32px"
                    })
                }, ""),
                h("h1", {
                    style: s({ fontSize: "18px", paddingTop: "1.5px" })
                }, "Ai32")
            ),
        )
    )

})

/**
 * @type {typeof component<{}>}
 */
export const FooterComponent = component
export const Footer = HeaderComponent(({}) => {
    return h("div", {},
        h("div", {
            style: s({
                borderTop: "1px solid #eee",
                padding: "8px"
            })
        },
            h("div", {
                style: s({ display: "flex", width: "100%", alignItems: "center", gap: "8px" })
            },
                h("img", {
                    attr: {
                        src: "/public/icon/mailbox.png"
                    },
                    style: s({
                        width: "32px",
                        height: "32px"
                    })
                }, ""),
                h("h1", {
                    style: s({ fontSize: "18px", paddingTop: "1.5px" })
                }, "Ai32")
            ),
            h("div", {
                style: s({ height: "180px" })
            })
        )
    )

})