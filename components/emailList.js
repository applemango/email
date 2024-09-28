import { useDynamicRouting } from "../hook/useDynamicRouting.js";
import { useLocalStorageState } from "../hook/useLocalStorageState.js";
import { s } from "../src/dom/style.js";
import { component, h } from "../src/dom/virtualdom.js";
import * as Types from "../src/email/type.js"

const getRandomSvgIcon = () => {
    const icons = [
        "1.svg",
        "2.svg",
        "3.svg",
        "4.svg",
    ]
    return "/public/boring/".concat(icons[Math.floor(Math.random() * icons.length)])
}

/**
 * @type {typeof component<{emails: Array<Types.Email>}>}
 */
export const EmailListComponent = component
export const EmailList = EmailListComponent(({ emails, onChangeEmail })=> {
    return h("div", {
        style: s({
            padding: "4px",
        }),
        class: "emailList"
    },
        emails.map((email, i) =>  {
            const avatar = getRandomSvgIcon()
            return h("div", {
                onClick: () => {
                    onChangeEmail(email)
                },
                style: s({
                    padding: "4px",
                    borderTop: !i ? "1px solid #eee" : "",
                    borderBottom: "1px solid #eee",
                    margin: "0",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                }),
            },
                h("div", {
                    style: s({
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        flex: "1 1 auto",
                        overflow: "hidden",
                        width: "210px"
                    })
                },
                    h("img", {
                        attr: {
                            src: avatar
                        },
                        style: s({
                            width: "24px",
                            height: "24px",
                            marginRight: "8px",
                        }),
                    }),
                    h("p", {
                        style: s({
                            fontSize: "16x",
                            color: "#aaa"
                        })
                    }, email.address_from.split("@")[0] || ""),
                ),
                h("div", {
                    style: s({
                        width: "80%",
                        overflow: "hidden",
                        flex: "1 1 auto",
                    }),
                    class: "emailListItem"
                },
                    h("p", {
                        style: s({
                            fontSize: "14px",
                            wordBreak: "keep-all",
                            
                        }),
                    }, email.body_subject || ""),
                ),
            )
        })
    )
})