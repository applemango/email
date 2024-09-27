//@ts-check
import { Email } from "../components/email.js"
import { EmailList } from "../components/emailList.js"
import { SideBar } from "../components/sidebar.js"
import { useEffect } from "../hook/useEffect.js"
import { useLocalStorageState } from "../hook/useLocalStorageState.js"
import { useState } from "../hook/useState.js"
import { s } from "../src/dom/style.js"
import { component, h, page } from "../src/dom/virtualdom.js"
import { getAllEmail } from "../src/email/fetch.js"
import * as EmailTypes from "../src/email/type.js"


export const App = page(() => {
    /**
     * 参照 => https://github.com/microsoft/TypeScript/issues/27387#issuecomment-1223795056
     * @type {typeof useState<Array<EmailTypes.Email>>}
     */
    const useListState = useState
    const [emails, setEmails] = useListState("emails", []);

    /**
     * @type {typeof useLocalStorageState<EmailTypes.Email | null>}
     */
    const useEmailState = useLocalStorageState
    const [email, setEmail] = useEmailState("email", null);

    

    useEffect("load", async () => {
        if (location.pathname == "/inbox.html" && email()) {
            setEmail(null)
        }
        const emails = await getAllEmail()
        setEmails(emails)
    })

    addEventListener("popstate", () => {
        setEmail(null)
    });

    return h("div", {
        style: s({
            display: "flex",
            minHeight: "100dvh",
            minWidth: "100dvw",
        })
    },

        SideBar({}),

        h("div", {
            style: s({
                width: "100%"
            })
        },
            email()
                ? h("div", {},
                    h("button", {
                        onClick: ()=> {
                            setEmail(null)
                        }
                    },
                        "close"
                    ),
                    Email({ email: email() }) 
                )
                : h("div",{}, EmailList({
                        emails: emails(), onChangeEmail: (email) => {
                            setEmail(email)
                        }
                    })
                )
        )

    )
})