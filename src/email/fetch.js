import { req } from "../utils/req.js"
import * as Types from "./type.js"

/**
 * @param {string} address
 * @returns {Array<Types.Email>}
 */
export const getInbox = async (address) => {
    return await req(`/email?address=${address}`)
}

/**
 * @returns {Array<Types.Email>}
 */
export const getAllEmail = async () => {
    return await req("/email")
}