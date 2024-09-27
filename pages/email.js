//@ts-check
import { Email } from "../components/email.js"
import { EmailList } from "../components/emailList.js"
import { useEffect } from "../hook/useEffect.js"
import { useLocalStorageState } from "../hook/useLocalStorageState.js"
import { useState } from "../hook/useState.js"
import { component, h, page } from "../src/dom/virtualdom.js"
import { getAllEmail } from "../src/email/fetch.js"
import * as EmailTypes from "../src/email/type.js"

export const App = page(() => {
    /**
     * @type {typeof useLocalStorageState<EmailTypes.Email | null>}
     */
    const useEmailState = useLocalStorageState
    const [email, setEmail] = useEmailState("email", null);

    return h("div", {},

        Email({email: email()})

    )
})