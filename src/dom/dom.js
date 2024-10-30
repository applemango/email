//@ts-check

/**
 * DOMからメタタグを取得する
 * @param {string} id
 * @returns { Element }
 */
export const getMetaTag = (id) => {
    const head = window.document.querySelector("head")
    const tag = head.querySelector(`meta[state_id="${id}"]`)
    // headにすでに目的のmetaタグが作成されていたらそれを返す
    if (tag) return tag
    // 作成されていなかったら新しく作る
    const newTag = window.document.createElement("meta")
    newTag.setAttribute("state_id", id)
    head.appendChild(newTag)
    return newTag
}

/**
 * DOMの完全な書き換え、よろしくないけどUXと可用性のためにいた仕方ない
 * @param {string} html
 */
export const writeDoc = (html) => {
    const doc = (new DOMParser).parseFromString(`${html}`, 'text/html');
    document.querySelector(":root").innerHTML = doc.documentElement.innerHTML;
}