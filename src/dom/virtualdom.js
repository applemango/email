//@ts-check

import { arrayToFlat } from "../utils/arr.js"

/**
 * DOMをObjectで構築するが、そのObjectを作る関数
 * なくてもいいが、あった方が便利なので作る
 * @param {"button" | "div" | "p" | "h1" | "input"} type 
 * @param { {
 *  onClick?: ()=> void,
 *  style?: string,
 *  class?: string,
 *  innerHTML?: string
 *} } props?
 * @param  {...any} children 
 * @returns Object
 */
export const h = (type, props, ...children) => {
    return {
        type, props, children
    }
}

/**
 * `componentRenderHelper`から切り出した子要素を親要素にくっつけていく関数
 * @param {Element} el 
 * @param {any} children 
 */
const componentRenderHelperChildren = (el, children) => {
    //fixChildren(children).map((c) => {
    children.map((c) => {
        if(Array.isArray(c)) {
            componentRenderHelperChildren(el, c)
            return
        }
        if (["string", "number", "boolean"].includes(typeof c)) {
            el.innerText = c
            return
        }
        return el.appendChild(componentRenderHelper(c))
    })
}

/**
 * hから出てきたvnodeをElementに変換していく関数、再起的に実行したいので切り出した
 * @param {any} vnode 
 * @returns Element
 */
const componentRenderHelper = (vnode) => {
    /**
     * @type Element
     */
    const el = window.document.createElement(vnode?.type || "div")
    if (!vnode) {
        console.log("vnode is undefined!")
        //el.innerText = vnode
        return el
    }
    if(vnode.props?.onClick) {
        el.addEventListener("click", vnode.props.onClick)
    }
    if(vnode.props?.class) {
        el.classList.add(vnode.props.class)
    }
    if(vnode.children) {
        componentRenderHelperChildren(el, vnode.children)
    }
    if(vnode.props?.style) {
        el.style = vnode.props.style
    }
    if(vnode.props?.innerHTML) {
        el.innerHTML = vnode.props.innerHTML
    }
    return el
}

/**
 * 要素が変更されたかどうか検出する関数
 * @param {any} vnodeOld 
 * @param {any} vnodeNew 
 * @returns [boolean, Array<string>]
 */
const isSomeElement = (vnodeOld, vnodeNew, deep = 0) => {
    //if(deep > 1) return [true, 0]
    /**
     * いずれにしても、子要素に変更が加えられた場合、再起的に実行される関数`componentPatchHelper`が差異を見つけるため。
     * この関数が深く見るのは計算量的に見ても非合理的である
     * その為、子要素の長さが違う時だけ修正すれば良い
     * @param {*} vnodeOld 
     * @param {*} vnodeNew 
     * @returns boolean
     */
    const isSomeChild = (vnodeOld, vnodeNew) => {
        if (vnodeNew == vnodeOld) return true
        if (typeof vnodeNew != typeof vnodeOld) return false
        if (fixChildren(Array.from(vnodeNew || [])).length != fixChildren(Array.from(vnodeOld || [])).length) return false
        if (fixChildren(Array.from(vnodeNew)).reduce((acc, _, i)=> {
            return acc || fixChildren(vnodeNew)[i]?.type != fixChildren(vnodeOld)[i]?.type
        }, false)) return false
        //if (typeof fixChildren(vnodeNew)[0] != typeof fixChildren(vnodeOld)[0]) return false
        /**
         * 計算量多すぎる、ここでも子要素を全部スキャンするのはいただけない
         */
        /*console.log(vnodeNew, vnodeOld, fixChildren(vnodeNew).length && fixChildren(vnodeNew).reduce((acc, _, i) => {
            //console.log(vnodeOld, vnodeNew)
            if (!acc && isSomeElement(fixChildren(vnodeOld)[i], fixChildren(vnodeNew)[i]))
                return false
            return true
        }, false))
        if (fixChildren(vnodeNew).length && fixChildren(vnodeNew).reduce((acc, _, i)=> {
            //console.log(vnodeOld, vnodeNew)
            if(!acc && isSomeElement(fixChildren(vnodeOld)[i], fixChildren(vnodeNew)[i], deep + 1))
                return acc || false
            return true
        }, false)) return false*/
        return true
    }
    const [o, n] = [vnodeOld, vnodeNew]
    const reasons = []
    if(vnodeOld.type!=vnodeNew.type)
        reasons.push("type")
    if(o.props?.class!=n.props?.class) reasons.push("class")
    if(o.props?.style!=n.props?.style) reasons.push("style")
    //if(vnodeOld!=vnodeNew) reasons.push("children")
    /**
     * 直下の子要素のnodeが変わっていた場合 ( eg: 増えたり減ったり、あるいはnodeの種類変わった場合 ) patchが適応できないので検出して子要素ごと根こそぎ再レンダリングする
     */
    if (!isSomeChild(vnodeOld.children, vnodeNew.children))
        reasons.push("children")
    /*if(
        (
            (typeof fixChildren(o.children) != "object")
                && fixChildren(o.children) != fixChildren(n.children)
        )
        ||
        (
            (typeof fixChildren(o.children) == "object")
                && fixChildren(o.children).length != fixChildren(n.children).length
        )
    ) reasons.push("children")*/
    return [reasons.length == 0, reasons]
}

/**
 * `h("div", list.map((item)=> h()))`みたいなことをすると配列が2次元になったりしてバグるのでそれの解消。
 * ちなみに、これを無くすこともできるが、一応。
 * @param {*} vnode 
 * @returns 
 */
export const fixChildren = (vnode) => {
    if(!Array.isArray(vnode)) {
        return vnode
    }
    return vnode.reduce((acc, e)=> {
        if(Array.isArray(e)) {
            return [...acc, ...e]
        }
        return [...acc, e]
    }, [])
    //return arrayToFlat(vnode)
}

/**
 * 受け取った変更箇所を元に要素に変更を加える
 * @param {Element} parent 
 * @param {Element} element 
 * @param {Array<string>} reason 
 * @param {any} vnode 
 * @param {any} oldNode 
 */
const patchElement = (parent, element, reason, vnode, oldNode) => {
    if (reason.includes("type")) {
        const e = componentRenderHelper(vnode)
        parent.replaceChildren(e)
    }
    if (reason.includes("class")) {
        element.classList.replace(oldNode.props.class, vnode.props.class)
    }
    if (reason.includes("style")) {
        element.style = vnode.props.style
    }
    if (reason.includes("children")) {
        const e = componentRenderHelper(vnode)
        //console.log(parent, element, reason, vnode, oldNode)
        //console.log(vnode, e)
        //element.replaceChildren(e)
        element.replaceWith(e)
    }
}

/**
 * 子要素が文字の時だけ別の処理が必要なので切り出した
 * @param {Element} element 
 * @param {any} vnode 
 * @param {any} oldNode 
 * @returns boolean
 */
const patchText = (element, vnode, oldNode) => {
    if (["string", "number", "boolean"].includes(typeof vnode)) {
        if(element.innerText != vnode.toString()) {
            //console.log(element, vnode)
            element.innerText = vnode
            return true
        }
    }
    return false
}

/**
 * 再起的に要素の変更を検出していく関数、検出されたら変更を加える関数に渡す
 * @param {Element} parent 
 * @param {any} vnodeOld 
 * @param {any} vnodeNew 
 * @param {number} index 
 * @returns 
 */
const componentPatchHelper = (parent, vnodeOld,  vnodeNew, index) => {
    /**
     * 今回は複雑なことはしないので、親要素から自分を取得するのに、単純な:nth-childを使った方法を使う
     *
     */
    //const thisEl = parent.querySelector(`${vnodeNew.type}:nth-child(${index})`)
    const thisEl = parent.querySelector(`*:nth-child(${index})`)
    //console.log(parent, thisEl, vnodeNew.children, `*:nth-child(${index})`)
    const [isSome, reason] = isSomeElement(vnodeOld, vnodeNew)
    //if(!isSome) return patchElement(parent, thisEl, reason, vnodeNew, vnodeOld)
    if (!isSome) patchElement(parent, thisEl, reason, vnodeNew, vnodeOld)
    //console.log(reason)
    if (reason.includes("children")) return
    if(Array.isArray(vnodeNew.children)) {
        //return fixChildren(vnodeNew.children).map((_, i) => {
        return vnodeNew.children.map((_, i) => {
            //const [oldChild, newChild] = [fixChildren(vnodeOld.children)[i], fixChildren(vnodeNew.children)[i]]
            const [oldChild, newChild] = [vnodeOld.children[i], vnodeNew.children[i]]
            //console.log(oldChild, newChild)
            /**
             * この時点で子要素が文字だと分かった場合は、子要素が変更されてるか確認して早めに切り上げる
             */
            if (patchText(thisEl, newChild, oldChild)) {
                return
            }
            /**
             * 子要素に対しても同じように再起的に処理を加えていく
             */
            componentPatchHelper(thisEl, oldChild, newChild, i + 1)
        })
    }
}

/**
 * ページクラスを作る関数、new Page()を使いたくないから作った、普通は不要
 * @param {any} page 
 * @returns 
 */
export const page = (page) => new Page(page)

/**
 * hで構築したページをレンダリングしたりするクラス。`render`は最初からpageを元にすべてのDOMを構築する。
 * `patch`は`this.old`に保存された前回のと新しいのを比較して、変更箇所のみをレンダリングする。
 * 速度を求めなければrender関数のみでよいが、最初から構築されてしまうため、アニメーションの実行などが面倒なので、一部のみ変更するpatchを作った
 */
export class Page {
    constructor(page) {
        this.page = page
        this.old = {}
    }
    render() {
        const res = this.page()
        this.old = res
        const v = componentRenderHelper(res)
        document.getElementById("root")?.replaceChildren(v)
    }
    patch() {
        const res = this.page()
        //console.log(res)
        componentPatchHelper(document.getElementById("root") , this.old, res, 1)
        this.old = res
    }
}

/**
 * コンポーネント、何もしない、ただのファイル分け用
 * @template T
 * @param {(props: T)=> any} c 
 * @returns (props: T) => any
 */
export const component = (c) => {
    return (props)=> {
        return c(props)
    }
}