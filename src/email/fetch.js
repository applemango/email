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

/**
 * @param {string} id 
 * @returns {Types.Email}
 */
export const getEmail = async (id) => {
    return await req(`/email/${id}`)
}

export const sendEmail = async (body) => {
    return await fetch("https://email-worker.i64.workers.dev/email", {
        method: "POST",
        body: JSON.stringify({
            to: body.to,
            from: body.from,
            subject:  body.subject,
            text: body.text,
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
}