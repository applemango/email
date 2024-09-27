//@ts-check
import { useEffect } from "../hook/useEffect.js"
import { useState } from "../hook/useState.js"
import { component, h, page } from "../src/dom/virtualdom.js"

/**
 * @type {typeof component<{list: Array<{id: number, title: string}>}>}
 */
export const ListComponent = component
export const List = ListComponent(({ list }) => {
    return h("div", {},
        list.map((item) => h("p", {},
            item.title
        ))
    )
})

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

export const App = page(() => {
    /**
     * 参照 => https://github.com/microsoft/TypeScript/issues/27387#issuecomment-1223795056
     * @type {typeof useState<Array<{id: number, title: string}>>}
     */
    const useListState = useState
    const [list, setList] = useListState("list", []);

    useEffect("load", async () => {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts")
        const json = await res.json()
        setList(json)
    })

    const show = list().concat().length ? 1 : 0

    return h("div", {},

        list().length ? h("div", {}, 
            h('h1', {
                style: "color: red"
            }, "hello, world!")
        ) : h("div", {}),

        h("button", {
            onClick: async () => {
                setList([])
                const res = await fetch("https://jsonplaceholder.typicode.com/posts")
                const json = await res.json();
                for(let i = 0; i < json.length; i++) {
                    setList([...list(), json[i]])
                    await sleep(30)
                }
            },
        }, "reload"),
        h("div", {
            style: `transition: all 1s ease; transform: scaleY(${show}); opacity: ${show}; overflow: hidden;`
        },
            List({ list: list() })
        ),

    )
})