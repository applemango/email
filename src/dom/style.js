export const CssProperty = {
    background: "background",
    opacity: "opacity",
    boxShadow: "box-shadow",
    padding: "padding",
    margin: "margin",
    marginRight: "margin-right",
    border: "border",
    borderTop: "border-top",
    borderLeft: "border-left",
    borderRight: "border-right",
    borderBottom: "border-bottom",
    display: "display",
    width: "width",
    minWidth: "min-width",
    height: "height",
    minHeight: "min-height"
}

/**
 * 
 * @param {typeof CssProperty} object 
 */
export const s = (object) => {
    return Object.keys(object).map((k)=> {
        const [key, value] = [k, object[k]]
        return `${CssProperty[key]}: ${value}`
    }).join(";")
}