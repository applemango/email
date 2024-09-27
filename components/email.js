import { s } from "../src/dom/style.js";
import { component, h } from "../src/dom/virtualdom.js";
import * as Types from "../src/email/type.js"
/**
 * @type {typeof component<{email: Types.Email}>}
 */
export const EmailComponent = component
export const Email = EmailComponent(({ email })=> {
    
    return h("div", {},
        h("div", {
            innerHTML: email.body_html,
            style: s({
                padding: "32px"
            })
        })
    )
    
})