import { useState } from "./useState.js"

/**
 *
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
export const useLocalStorageState = (id, v) => {
    const localStorageValue = localStorage.getItem(id)
    const value = localStorageValue ? JSON.parse(localStorageValue).value : v
    const [state, setState] = useState(id, value)
    return [
        ()=> state(),
        (value)=> {
            localStorage.setItem(id, JSON.stringify({ value }))
            setState(value)
        }
    ]
}