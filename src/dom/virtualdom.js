//@ts-check

/**
 * @typedef {"button" | "div" | "p" | "h1" | "input" | "img" | "a" | "h2" | "h3" | "h4" | "h5" | "h6"} VNodeType
 *
 * @typedef VNodeProps
 * @property {(e)=> {}?} onClick
 * @property {(e)=> {}?} onChange
 * @property {string?} style
 * @property {string?} class
 * @property {string?} innerHTML
 * @property {object?} attr
 *
 * @typedef {VNode | string | boolean | number} VNodeChild
 * @typedef {Array<VNodeChild>} VNodeChildren
 *
 * @typedef VNode
 * @property {VNodeType} type
 * @property {VNodeProps} props
 * @property {VNodeChildren} children
 */


/**
  * DOMをObjectで構築するが、そのObjectを作る関数
  * なくてもいいが、あった方が便利なので作る
  *
  * @param {VNodeType} type
  * @param {VNodeProps} props
  * @param  {...VNodeChild} children
  * @returns {VNode}
  */
export const h = (type, props, ...children) => {
    return {
        type, props, children
    }
}

/**
 * `componentRenderHelper`から切り出した子要素を親要素にくっつけていく関数
 * @param {Element} el
 * @param {VNodeChildren} children
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

export const handleEvent = {
    onClick: "click",
    onChange: "change"
}

/**
 * hから出てきたvnodeをElementに変換していく関数、再起的に実行したいので切り出した
 * @param {VNode} vnode
 * @returns Element
 */
const componentRenderHelper = (vnode) => {
    /**
     * @type Element
     */
    const el = window.document.createElement(vnode?.type || "div")
    const props = vnode.props
    if (!vnode || !props) return el

    if(props.class) el.classList.add(props.class)
    if(vnode.children) componentRenderHelperChildren(el, vnode.children) // @ts-ignore
    if(props.style) el.style = props.style
    if(props.innerHTML) el.innerHTML = props.innerHTML

    /**
     * DOM要素にイベントリスナーをつけていく
     */
    Object.keys(props).map((key) => {
        if (handleEvent[key]) {
            el.addEventListener(handleEvent[key], vnode.props[key])
        }
    })

    /**
     * DOM要素に属性をつけていく
     */
    if(props.attr) {
        Object.keys(vnode.props.attr).map((key)=> {
            el.setAttribute(key, vnode.props.attr[key])
        })
    }
    return el
}

/**
 * 要素が変更されたかどうか検出する関数
 * @param {VNode} vnodeOld
 * @param {VNode} vnodeNew
 * @returns [boolean, Array<string>]
 */
const isSomeElement = (vnodeOld, vnodeNew) => {
    /**
     * 子要素に変更が加えられた場合、再起的に実行される関数`componentPatchHelper`が差異を見つけるため。
     * この関数が深く見るのは計算量的に見てもあまりよくない
     * その為、子要素の長さが違う時とTypeが違う時だけ修正すれば良い
     * @param {*} vnodeOld
     * @param {*} vnodeNew
     * @returns boolean
     */
    const isSomeChild = (vnodeOld, vnodeNew) => {
        /**
         * 二つが全く同じ場合は計算量を減らすため即座にtrueを返す、ただしオブジェクトは含まない
         */
        if (vnodeNew == vnodeOld) return true
        /**
         * 二つの要素のTypeが違うならそもそも同じはずないのでfalse
         */
        if (typeof vnodeNew != typeof vnodeOld) return false

        const vnodeNewChildren = fixChildren(Array.from(vnodeNew || []))
        const vnodeOldChildren = fixChildren(Array.from(vnodeOld || []))

        /**
         * 二つの要素の子要素の数が違うなら同じではないのでfalse
         */
        if (vnodeNewChildren.length != vnodeOldChildren.length) return false

        /**
         * 二つの要素の子要素それぞれに対してTypeが一致しているかみる、子要素のTypeが不一致だと
         * 子要素が自分を再レンダリングするより、親要素が子要素を再レンダリングした方が楽
         */
        if (vnodeNewChildren.reduce((acc, _, i)=> {
            return acc || vnodeNewChildren[i]?.type != vnodeOldChildren[i]?.type
        }, false)) return false

        /**
         * 何もなければ同一と判断する
         */
        return true
    }
    const reasons = []
    if(vnodeOld.type!=vnodeNew.type)
        reasons.push("type")
    if(vnodeOld.props?.class!=vnodeNew.props?.class) reasons.push("class")
    if(vnodeOld.props?.style!=vnodeNew.props?.style) reasons.push("style")

    /**
     * 直下の子要素のnodeが変わっていた場合 ( eg: 増えたり減ったり、あるいはnodeの種類変わった場合 ) patchが適応できないので検出して子要素ごと根こそぎ再レンダリングする
     */
    if (!isSomeChild(vnodeOld.children, vnodeNew.children))
        reasons.push("children")

    return [reasons.length == 0, reasons]
}

/**
 * `h("div", list.map((item)=> h()))`みたいなことをすると配列が2次元になったりしてバグるのでそれの解消。
 * ちなみに、これを無くすこともできるが、一応。
 * @param {Array<VNode | Array<VNode>>} vnode
 * @returns {Array<VNode>}
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
}

/**
 * 受け取った変更箇所を元に要素に変更を加える
 * @param {Element} parent
 * @param {Element} element
 * @param {Array<string>} reason
 * @param {VNode} vnode
 * @param {VNode} oldNode
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
        element.replaceWith(e)
    }
}

/**
 * 子要素が文字の時だけ別の処理が必要なので切り出した
 * @param {Element} element
 * @param {VNode} vnode
 * @param {VNode} oldNode
 * @returns boolean
 */
const patchText = (element, vnode, oldNode) => {
    if (["string", "number", "boolean"].includes(typeof vnode)) {
        if(element.innerText != vnode.toString()) {
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
const componentPatchHelper = (parent, vnodeOld,  vnodeNew, index = 0) => {
    const thisEl = parent.childNodes[index]
    const [isSome, reason] = isSomeElement(vnodeOld, vnodeNew)

    if (!isSome) patchElement(parent, thisEl, reason, vnodeNew, vnodeOld)
    /**
     * 直下の子要素に対して変更が加えられていた場合、既に再レンダリングされているので処理を打ち切る
     */
    if (reason.includes("children")) return

    /**
     * レンダリングする必要がある子要素は常に配列で渡される
     * 逆に言えばundefinedなど不必要なものは配列で渡されないので無視する
     */
    if(!Array.isArray(vnodeNew.children)) return

    return vnodeNew.children.map((_, i) => {
        const [oldChild, newChild] = [vnodeOld.children[i], vnodeNew.children[i]]
        /**
         * この時点で子要素が文字だと分かった場合は、子要素が変更されてるか確認して早めに切り上げる
         */
        if (patchText(thisEl, newChild, oldChild)) {
            return
        }
        /**
         * 子要素に対しても同じように再起的に処理を加えていく
         */
        componentPatchHelper(thisEl, oldChild, newChild, i)
    })
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
        const root = document.getElementById("root")
        this.old = res
        const v = componentRenderHelper(res)
        root?.replaceChildren(v)
    }
    patch() {
        const res = this.page()
        const root = document.getElementById("root")
        componentPatchHelper(root, this.old, res)
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