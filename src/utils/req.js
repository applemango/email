export const req = async (url, object) => {
    const res = await fetch("https://email-worker.i64.workers.dev".concat(url), {
        body: object
    })
    return await res.json()
}