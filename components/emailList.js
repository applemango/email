import { useDynamicRouting } from "../hook/useDynamicRouting.js";
import { useLocalStorageState } from "../hook/useLocalStorageState.js";
import { s } from "../src/dom/style.js";
import { component, h } from "../src/dom/virtualdom.js";
import * as Types from "../src/email/type.js"

/**
 * @type {typeof component<{emails: Array<Types.Email>}>}
 */
export const EmailListComponent = component
export const EmailList = EmailListComponent(({ emails, onChangeEmail })=> {

    /**
     * @type {typeof useLocalStorageState<EmailTypes.Email | null>}
     */
    /*const useEmailState = useLocalStorageState
    const [email, setEmail] = useEmailState("email", null);*/

    return h("div", {
        style: s({
            padding: "4px",
        }),
        class: "emailList"
    },
        emails.map((email) => 
            h("div", {
                onClick: () => {
                    onChangeEmail(email)
                },
                style: s({
                    padding: "4px",
                    borderTop: "1px solid #eee",
                    margin: "0",
                }),
                class: "emailListItem"
            },
                h("p", {}, email.body_subject)
            )
        )
    )
})