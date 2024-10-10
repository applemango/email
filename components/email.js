import { component, h } from "../src/dom/virtualdom.js";
import * as Types from "../src/email/type.js"
/**
 * @type {typeof component<{email: Types.Email}>}
 */
export const EmailComponent = component
export const Email = EmailComponent(({ email })=> {
    
    return h("div", {},
        h("iframe", {
            style: "height: calc(100dvh - 48px); margin: 0; border: none; border-top-left-radius: 8px; border-top-right-radius: 8px;",
            attr: {
                srcdoc: email.body_html || `<pre style="padding: 16px;">${email.body_text}</pre>`,
                width: "100%",
                sandbox: "allow-downloads"
            }
        })
    )
    
})