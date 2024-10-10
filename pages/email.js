import { Email } from "../components/email.js"
import { EmailList } from "../components/emailList.js"
import { useDynamicRouting } from "../hook/useDynamicRouting.js"
import { useEffect } from "../hook/useEffect.js"
import { useLocalStorageState } from "../hook/useLocalStorageState.js"
import { useState } from "../hook/useState.js"
import { router } from "../src/dom/route.js"
import { s } from "../src/dom/style.js"
import { component, h, page } from "../src/dom/virtualdom.js"
import { getAllEmail, getEmail } from "../src/email/fetch.js"
import * as EmailTypes from "../src/email/type.js"
import { EmailContainer } from "./inbox.js"

export const App = page(() => {
    /**
     * @type {typeof useLocalStorageState<EmailTypes.Email | null>}
     */
    const useEmailState = useLocalStorageState
    const [email, setEmail] = useEmailState("email", null);

    const { go } = useDynamicRouting()

    useEffect("load", async () => {
        const url = new URL(window.location.href)
        const id = url.searchParams.get("id")
        router.historyPush(`/email/${id}`)
        if(id && id != email()?.uuid) {
            const email = await getEmail(id)
            if(!email) {
                go("/inbox")
                return
            }
            setEmail(email)
        }
    })

    return h("div", {},

        email() ? h("div", {},
            EmailContainer({ email, setEmail: ()=> {
                go("/inbox")
            } })
        ) : h("div", {},
            h("h1", {}, "Email not found")
        )

    )
})