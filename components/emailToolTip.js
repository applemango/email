import { useLocalStorageState } from "../hook/useLocalStorageState.js";
import { s } from "../src/dom/style.js";
import { component, h } from "../src/dom/virtualdom.js";
import * as Types from "../src/email/type.js"
/**
 * @type {typeof component<{email: Types.Email}>}
 */
export const EmailToolTipComponent = component
export const EmailToolTip = EmailToolTipComponent(({ }) => {

    /**
     * @type {typeof useLocalStorageState<EmailTypes.Email | null>}
     */
    const useEmailState = useLocalStorageState
    const [email, setEmail] = useEmailState("email", null);

    return h("div", {
        style: s({
            borderBottom: "1px solid #eee",
            padding: "8px"
        }).concat("; position: fixed; width: 100%; background-color: #fff;")
    },
        h("button", {
            onClick: () => {
                setEmail(null)
            },
            class: "emailToolTipButton"
        },
            "close"
        ),
    )

})