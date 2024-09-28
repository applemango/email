import { Footer, Header } from "../components/header.js"
import { useDynamicRouting } from "../hook/useDynamicRouting.js"
import { useEffect } from "../hook/useEffect.js"
import { useLocalStorageState } from "../hook/useLocalStorageState.js"
import { useState } from "../hook/useState.js"
import { s } from "../src/dom/style.js"
import { component, h, page } from "../src/dom/virtualdom.js"

export const App = page(() => {
    /**
     * 参照 => https://github.com/microsoft/TypeScript/issues/27387#issuecomment-1223795056
     * @type {typeof useState<Array<{id: number, title: string}>>}
     */
    const useListState = useState
    const [list, setList] = useListState("list", []);

    /**
     * @type {typeof useLocalStorageState<string>}
     */
    const useAddressState = useLocalStorageState
    const [address, setAddress] = useAddressState("address", "")

    const { go } = useDynamicRouting()


    return h("div", {},

        Header({}),

        h("div", {
            style: s({ padding: "32px" })
        },
            h("p", {
                style: s({ fontSize: "48px" })
            },
                "最高のメール体験を"
            ),
            h("p", {
                style: s({ fontSize: "32px" })
            },
                "助けてくれるAIと👋"
            ),

            h("div", {
                style: s({
                    display: "flex",
                    alignItems: "center",
                    gap: "32px"
                })
            },
                h("div", {
                    style: s({
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                    })
                },
                    h("input", {
                        style: s({
                            border: "1px solid #eee",
                            borderRadius: "6px",
                            height: "42px",
                            width: "160px",
                            paddingLeft: "16px",
                            fontSize: "20px"
                        }),
                        onChange: (e) => {
                            setAddress(e.target.value)
                        },
                        attr: {
                            placeholder: "ai32",
                            value: address()
                        }
                    }),
                    h("p", {
                        style: s({
                            fontSize: "24px",
                            color: "#888"
                        }),
                    }, "@i32.jp"),
                ),
                h("button", {
                    style: s({
                        border: "none",
                        background: "#0083fa",
                        color: "#fff",
                        height: "46px",
                        fontSize: "16px",
                        margin: "0 0 0 8px",
                        borderRadius: "4px",
                        paddingLeft: "16px",
                        paddingRight: "16px",
                        cursor: "pointer"
                    }),
                    onClick: () => {
                        go("/inbox.html")
                    }
                }, "Check your Inbox")
            ),

            h("div",{
                style: s({
                    display: "flex",
                    justifyContent: "center",
                })
            },
                h("img", {
                    attr: {
                        src: "/public/lp/img.png"
                    },
                    style: s({
                        width: "100%",
                        margin: "0 auto"
                    })
                })
            )

        ),

        Footer({})

    )
})