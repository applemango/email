import { s } from "../src/dom/style.js";
import { component, h } from "../src/dom/virtualdom.js";
import * as Types from "../src/email/type.js"
/**
 * @type {typeof component<{email: Types.Email}>}
 */
export const EmailComponent = component
export const Email = EmailComponent(({ email })=> {
    
    return h("div", {},
        h("iframe", {
            style: "height: calc(100dvh - 48px); margin: 0; border: none; border-radius: 8px;",
            attr: {
                srcdoc: email.body_html || email.body_text,
                width: "100%",
                sandbox: "allow-script"
            }
        })
    )
    
})