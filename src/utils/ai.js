// 機械による自動的な収集を避ける為、ちなみに悪用されることは予想してる
// backendはあまり使いたくないので仕方ない
const WIHFAOJFPOHEWRFEWCFHBG = ["g", "s", "k", "_"].join("").concat("8lvtEL8BaXNA9g").concat("YaCiswWGdyb3").concat("FYLVh3ErQOrE4cgE2CucWOVJXT")

/**
 * LLMにプロンプトを渡して一番上の結果を返す
 * @param {string} content 
 * @returns string
 */
export const getGroqChatCompletion = async (content) => {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${WIHFAOJFPOHEWRFEWCFHBG}`,
        },
        ContentType: "application/json",
        body: JSON.stringify({
            messages: [
                {"role": "user", "content": content}
            ],
            model: "gemma2-9b-it"
        })
    })
    const json = await res.json()
    return json.choices[0].message.content
}

/**
 * AIにpromptを渡して、streamで返してもらう、内容はparseしてevent関数に渡していく
 * @param {*} content 
 * @param {(text: string)=> void} event 
 */
export const getGroqChatCompletionStream = async (content, event) => {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${WIHFAOJFPOHEWRFEWCFHBG}`,
        },
        ContentType: "application/json",
        body: JSON.stringify({
            messages: [
                { "role": "user", "content": content }
            ],
            model: "gemma2-9b-it",
            stream: true
        })
    })
    /**
     * web streamのparseとか
     */
    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    try {
        const read = async () => {
            const { done, value } = await reader.read();
            const chunk = decoder.decode(value, { stream: true });
            
            /**
             * 結果はdata: {"id": 1, ...}みたいな物が、複数行にまたがって帰ってくるので綺麗に整える
             */
            const parsed = chunk
                            .split("data: ")
                            .filter((text)=> text.startsWith("{\"id\":"))
                            .map((text)=> JSON.parse(text))
                            .map((json)=> json.choices[0].delta.content)
                            .join("")

            event(parsed)

            if (done) return reader.releaseLock();
            return read();
        };
        read();
    } catch (e) {
        console.error(e);
    }
}