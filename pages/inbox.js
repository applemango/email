import { Email } from "../components/email.js"
import { EmailForm } from "../components/emailform.js"
import { EmailList } from "../components/emailList.js"
import { EmailToolTip } from "../components/emailToolTip.js"
import { SideBar } from "../components/sidebar.js"
import { useDynamicRouting } from "../hook/useDynamicRouting.js"
import { useEffect } from "../hook/useEffect.js"
import { useLocalStorageState } from "../hook/useLocalStorageState.js"
import { useState } from "../hook/useState.js"
import { router } from "../src/dom/route.js"
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


export const EmailContainer = component(({ email, setEmail })=> {
    return h("div", {},
        h("div", {
            style: s({
                display: "flex",
                justifyContent: "center",
                paddingTop: "48px",
            }),
        },
            EmailSidebar({ onBack: () => {
                setEmail(null)
                router.historyPush(`/inbox`)
            } }),
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
})

export const EmailBoxContainer = component(({emails, setEmail, groq })=> {

    /**
     * @type {typeof useState<boolean>}
     */
    const useIsCompose = useState
    const [isCompose, setIsCompose] = useIsCompose("compose", false)
    

    /**
     * @type {typeof useState<boolean>}
     */
    const useIsSended = useState
    const [isSended, setIsSended] = useIsCompose("sended", false)

    return h("div", {
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
                    paddingBottom: "0",
                    marginBottom: "0",
                })
            },

                h("p", {
                    style: s({
                        color: "#222",
                        fontSize: "14px"
                    })
                }, groq() || "")
            ),
        ),

        h("div", {
            style: s({
                height: isCompose() ? "0px" : "72px",
                transition: "0.3s",
                transitionDelay: "0.6s",
                overflow: "hidden",
            })
        },
            h("div", {
                style: s({
                    //boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",,
                    border: "1px solid #eee",
                    borderRadius: "8px",
                    marginBottom: "16px",
                    padding: "4px 16px",
                    display: "flex",
                    //justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "0.3s",
                    gap: "16px",
                    opacity: isCompose() ? "0" : "1",
                    transition: "0.3s",
                    transform: isCompose() ? "scaleX(0)" : "scaleX(1)",
                }),
                onClick: () => {
                    setIsCompose(true)
                    setIsSended(false)
                }
            },
                h("img", {
                    attr: {
                        src: "/public/icon/pena.png",
                        width: "18px",
                        height: "18px",
                    }
                }),
                h("p", {
                    style: s({
                        color: "#777",
                        fontSize: "14px"
                    })
                }, "Compose New Email")
            ),
        ),

        h("div", {
            style: s({
                transform: isCompose() ? "scaleY(1)" : "scaleY(0)",
                opacity: isCompose() ? "1" : "0",
                transformOrigin: "top",
                height: isCompose() ? "322px" : "0px",
                overflow: "hidden",
                marginBottom: "16px",
                transition: "0.6s",
                transitionDelay: "0.9s",
            })
        },
          EmailForm({})  
        ),

        h("div", {},
            EmailList({
                emails: emails(), onChangeEmail: (email) => {
                    setEmail(email)
                    router.historyPush(`/email/${email.uuid}`)
                }
            })
        )

    )
})

export const App = page(() => {

    const { go } = useDynamicRouting()

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
    if(!address()) {
        go("/")
    }

    /**
     * @type {typeof useState<string>}
     */
    const useGroqState = useState
    const [groq, setGroq] = useGroqState("groq", "");

    useEffect("load", async () => {
        if (location.pathname == "/inbox.html" || location.pathname == "/inbox" && email()) {
            setEmail(null)
        }
        const emails = await getInbox(address().concat("@i32.jp"))

        /**
         * @type {EmailTypes.Email}
         */
        const welcomeEmail = {
            body_subject: "Welcome to i32.jp",
            body_html: `
                <div style="padding: 16px;">
                    <pre>
                        <code>
                            # 📬 Ai32

                            > [!NOTE]
                            > This is created by me for me



                            ## Feature

                            - ワンクリックで @i32.jpのメールアドレスが使える
                            - AIによるメールボックスの要約
                              - AIがメールボックスにあるメールを要約して重要なメールを見逃しません!
                            - シンプルなUI
                              - シンプルなUIで余計な情報をそぎ落とし、ユーザーに迷いを与えません!



                            ## TODO

                            * [X] メール送信
                            * [X] メール作成のテンプレート
                            * [  ] android端末において、emailがfetchされない、もしくは描写されない
                        </code>
                    </pre>
                </div>
            `,
            address_from: "email@i32.jp",
            address_to: address(),
            date: new Date().toISOString(),
        }
        setEmails([welcomeEmail])

        if(emails.length) {
            setEmails(emails.concat().reverse())
            
            setGroq("")
            await getGroqChatCompletionStream(`please summarize emails! in shorter, eg: show most important email , and do not use markdown style, you should use plain text, if you want to use list you can use - not *, finally: 日本語で応答して、絵文字を多用してください、特にリストの場合は最初に絵文字をつけてわかりやすくしてください、最後に重要なのを書いて、リストの長さは最大でも五つにとどめてください\n emails: ${emails.concat().reverse().slice(0, 30).map((e) => e.body_subject).join(",")}`, (event) => {
                console.log(event)
                setGroq(groq().concat(event))
            })
            
            return
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
            h("div", {
                style: s({
                    position: "fixed",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    opacity: email() ? "1" : "0",
                    transition: "0.3s",
                    pointerEvents: email() ? "auto" : "none",
                })
            }, 
                email() ? EmailContainer({ setEmail, email }) : h("div", {})
            ),
            
            h("div", {
                style: s({
    
                    opacity: email() ? "0" : "1",
                    transition: "0.3s",
                    pointerEvents: email() ? "none" : "auto",
                })
            },
                EmailBoxContainer({ emails, setEmail, groq })
            )
        )

    )
})