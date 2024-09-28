import { s } from "../src/dom/style.js";
import { component, h } from "../src/dom/virtualdom.js";
import * as Types from "../src/email/type.js"
/**
 * @type {typeof component<{email: Types.Email}>}
 */
export const SideBarComponent = component
export const SideBar = SideBarComponent(({}) => {

    return h("div", {
        style: s({
            width: "250px",
            borderRight: "1px solid #eee",
            marginRight: "0px",
            display: "flex",
            flexDirection: "column",
            padding: "8px"
        })
    },
        h("button", {
            class: "sidebarButton"
        }, "Inbox")
    )

})