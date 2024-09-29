import { useEffect } from "../hook/useEffect.js";
import { useLocalStorageState } from "../hook/useLocalStorageState.js";
import { useState } from "../hook/useState.js";
import { s } from "../src/dom/style.js";
import { component, h } from "../src/dom/virtualdom.js";
import { sendEmail } from "../src/email/fetch.js";
import * as Types from "../src/email/type.js"
import { getGroqChatCompletionStream } from "../src/utils/ai.js";


export const EmailFormField = component(({
    label, value, onChange, type="text", placeholder, node = "input"
})=> {
    return h("div", {
        style: s({
            display: "flex",
            alignItems: node == "textarea" ? "flex-start" : "center",
            gap: "8px"
        })
    },
        h("p", {
            style: s({
                width: "120px",
                textAlign: "right",
                paddingRight: "8px",
                //paddingTop: "8px",
                color: "#aaa",
                fontSize: "14px",
            })
        }, label),
        h(node, {
            onChange: (e)=> {
                console.log(e.innerText || e.target.value)
                onChange(e.innerText || e.target.value)
            },
            attr: {
                placeholder,
                type,
                value: value || "",
                class: label
            },
            style: s({
                flex: 1,
                border: "none",
                borderRadius: "4px",
                padding: "4px",
                height: node == "textarea" ? "140px" : "24px",
                borer: "none",
                paddingTop: "6px",
                fontSize: "14px",
                marginTop: node == "textarea" ? "6px" : "",
                resize: "none"
            })
        }, node == "textarea" ? (value || "") : ""),
    )
})


/**
 * @type {typeof component<{}>}
 */
export const EmailFormComponent = component
export const EmailForm = EmailFormComponent(({ }) => {

    /**
     * @type {typeof useLocalStorageState<string>}
     */
    const useAddressState = useLocalStorageState
    const [address, setAddress] = useAddressState("address", "")

    /**
     * @type {typeof useLocalStorageState<string>}
     */
    const useToState = useLocalStorageState
    const [to, setTo] = useToState("to", "");

    /**
     * @type {typeof useLocalStorageState<string>}
     */
    const useFromState = useLocalStorageState
    const [from, setFrom] = useFromState("from", address().concat("@i32.jp"));

    /**
     * @type {typeof useLocalStorageState<string>}
     */
    const useSubjectState = useLocalStorageState
    const [subject, setSubject] = useSubjectState("subject", "");

    /**
     * @type {typeof useLocalStorageState<string>}
     */
    const useBodyState = useLocalStorageState
    const [body, setBody] = useBodyState("body", "");

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

    const changeBody = (value) => {
        setBody(value)
        document.querySelector("textarea.body").value = value
    }

    const clearAll = () => {
        setTo("")
        setSubject("")
        setBody("")
        document.querySelector("input.To").value = ""
        document.querySelector("input.Subject").value = ""
        document.querySelector("textarea.Body").value = ""
    }

    /**
     * jsで改行をなんとかするにはこれしかなかった
     */
    useEffect("loademailform", async ()=> {
        const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
        await sleep(1000)
        changeBody(body() || "")
    })

    return h("div", {},
        
        h("div",{
            style: s({
                borderTop: "1px solid #eee",
                marginLeft: "4px",
                marginRight: "4px",
            })
        },
            EmailFormField({
                label: "To",
                value: to(),
                onChange: setTo,
                placeholder: "help@i32.jp"
            }),

            EmailFormField({
                label: "From",
                value: from(),
                onChange: setFrom,
                placeholder: "me@i32.jp"
            }),
            
            EmailFormField({
                label: "Subject",
                value: subject(),
                onChange: setSubject,
                placeholder: "Hello"
            }),

            EmailFormField({
                label: "Body",
                value: body(),
                onChange: setBody,
                placeholder: `Hello, im ${from()}`,
                node: "textarea"
            }),

            h("div", {
                style: s({
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "8px",
                    gap: "8px",
                    paddingLeft: "126px"
                })
            },
                h("div", {
                    style: s({

                    })
                },
                    h("button", {
                        onClick: () => {
                            changeBody("")
                            getGroqChatCompletionStream(
                                `すでにある本文とタイトルからメールの本文を作成してください、尚その際は敬語を使うものとして、与えられてない情報は適切に補完してください、汎用的な本文にしてください。尚件名は書く必要はありません。\nタイトル: ${subject()}\n本文: ${body()}`,
                                (text)=> {
                                    console.log(text)
                                    changeBody(body() + text)
                                }
                            )
                        },
                        style: s({
                            paddingLeft: "24px",
                            paddingRight: "24px"
                        }),
                        class: "emailSidebarButton"
                    },
                        "Write With Ai"
                    ),
                ),

                h("div", {
                    style: s({
                        display: "flex",
                        gap: "8px",
                    })
                },
                    h("button", {
                        onClick: () => {
                            clearAll()
                            setIsCompose(false)
                        },
                        class: "emailSidebarButton"
                    },
                        "delete"
                    ),
                    h("button", {
                        style: s({
                            color: isSended() ? "#4CAF50" : "#000"
                        }),
                        onClick: async () => {
                            setIsCompose(false)
                            setIsSended(true)
                            const res = await sendEmail({
                                to: to(),
                                from: from(),
                                subject: subject(),
                                text: body(),
                            })
                            const json = await res.json()
                            if(json.ok) { 
                                clearAll()
                            }
                            
                        },
                        class: "emailSidebarButton"
                    },
                        isSended() ? "sending..." : "send"
                    )
                )
            )
        )

    )

})