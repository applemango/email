import { req } from "../utils/req.js"
import * as Types from "./type.js"


export const getInbox = () => {

}
/**
 * @returns {Array<Types.Email>}
 */
export const getAllEmail = async () => {
    return await req("/email")
}