import { Email } from "../components/email.js"
import { EmailList } from "../components/emailList.js"
import { EmailToolTip } from "../components/emailToolTip.js"
import { SideBar } from "../components/sidebar.js"
import { useEffect } from "../hook/useEffect.js"
import { useLocalStorageState } from "../hook/useLocalStorageState.js"
import { useState } from "../hook/useState.js"
import { s } from "../src/dom/style.js"
import { component, h, page } from "../src/dom/virtualdom.js"
import { getAllEmail, getInbox } from "../src/email/fetch.js"
import * as EmailTypes from "../src/email/type.js"
import { getGroqChatCompletion, getGroqChatCompletionStream } from "../src/utils/ai.js"


/**
 * @type {typeof component<{
 *     onBack: ()=>void
 * }>}
 */
export const EmailSidebarComponent = component
export const EmailSidebar = EmailSidebarComponent(({
    onBack
})=> {
    return h("div", {
        style: s({
            width: "120px",
            padding: "16px",
            paddingTop: "32px",
        })
    },
        h("button", {
            onClick: () => {
                onBack()   
            },
            class: "emailSidebarButton"
        },
            "back"
        )
    )
})


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

    /**
     * @type {typeof useLocalStorageState<string>}
     */
    const useAddressState = useLocalStorageState
    const [address, setAddress] = useAddressState("address", "")

    /**
     * @type {typeof useState<string>}
     */
    const useGroqState = useState
    const [groq, setGroq] = useGroqState("groq", "");
        
    

    useEffect("load", async () => {
        if (location.pathname == "/inbox.html" && email()) {
            setEmail(null)
        }
        const emails = await getInbox(address().concat("@i32.jp"))
        setEmails(emails.reverse())

        if(emails.length) {
            setGroq("")
            await getGroqChatCompletionStream(`please summarize emails! in shorter, eg: show most important email , and do not use markdown style, you should use plain text, if you want to use list you can use - not *, finally: 日本語で応答して、絵文字を多用してください、特にリストの場合は最初に絵文字をつけてわかりやすくしてください、最後に重要なのを書いて、リストの長さは最大でも五つにとどめてください\n emails: ${emails.reverse().slice(0, 30).map((e) => e.body_subject).join(",")}`, (event) => {
                console.log(event)
                setGroq(groq().concat(event))
            })
        }
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

        //SideBar({}),

        h("div", {
            style: s({
                width: "100%",
                maxHeight: "100dvh",
                overFlow: email() ? "hidden" : "auto",
                paddingRight: "0"
            }),
            class: "main"
        },
            email()
                ? h("div", {},
                    h("div", {
                            style: s({
                                display: "flex",
                                justifyContent: "center",
                                paddingTop: "48px",
                            }),
                        },
                        EmailSidebar({ onBack: () => setEmail(null) }),
                        h("div", {
                            style: s({
                                width: "80%",
                                maxWidth: "800px",
                                boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                                paddingBottom: "48px",
                                borderRadius: "8px"
                            })
                        },
                            Email({ email: email() }) 
                        )
                    )
                )
                : h("div",{
                    style: s({
                        paddingLeft: "32px",
                        paddingRight: "32px",
                        paddingBottom: "32px"
                    })
                }, 

                    h("div", {
                        style: s({
                        })
                    },
                        h("div", {
                            style: s({
                                //background: "#C5E1A5",
                                opacity: "0.8",
                                margin: "16px",
                                padding: "16px",
                                borderRadius: "8px",
                            })
                        },

                            h("p", {
                                style: s({
                                    color: "#E91E63"
                                })
                            }, groq() || "hello!")
                        ),
                    ),
                    
                    h("div", {},
                        EmailList({
                            emails: emails(), onChangeEmail: (email) => {
                                setEmail(email)
                                document.querySelector(".main").scrollTo({ top: 0 })
                            }
                        })
                    )

                )
        )

    )
})