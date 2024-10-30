//@ts-check
import { getMetaTag } from "../src/dom/dom.js"
/**
 * # docs
 * reactのuseStateの模倣。
 * idが同じ場合、複数の場所で定義されてても値は同期されるし、onChangeイベントが発火する。
 * どちらかと言えばglobal stateに近い。
 * # usage
 * ```
    window.addEventListener("load", (()=> {
        const btn = document.querySelector("button")

        const [state, setState] = useState("state", 0, {
            onChange: (value)=> {
                btn.innerText = `value: ${value}`
            }
        })

        btn.addEventListener("click", ()=> {
            setState(state() + 1)
        })
        setState(0)
    }))
 * ```
 * Reactと同じ感じにしないと書けない病気
 * h()は流石に実装しない  ( Virtual DOMの話 ) <- 追記: 実装した
 * @template T
 * @param {string} id
 * @param {T} value
 * @param { {
 *       doc?: Document,
 *       defaultValue?: T,
 *       onChange?: (value: T)=> void
 * }? } option
 * @returns { [()=> T, (value: T)=> void] }
 */
export const useState = (id, value, option = {}) => {
    // 値を保存するためにHeadにMetaタグを追加し、そこにデータを書き込む
    const element = getMetaTag(id)
    const getValue = ()=> {
        return JSON.parse(element.innerText).value
    }
    const setValue = (value) => {
        // { value }とするのはvalueが型に依存しないで動作させるため
        // { value: value }と同義
        element.innerText = JSON.stringify({ value })
    }
    if(!element.innerText) {
        setValue(value)
    }

    return [
        ()=> getValue(),
        (value)=> {
            setValue(value)
        }
    ]
}