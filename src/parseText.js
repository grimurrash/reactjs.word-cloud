export default function parseText(res) {
    let text = res.answers;
    text = text.map(str => {
        str = str.trim()
        str = str.trimStart()
        return str
    })
    text = text.filter(str => {
        return str.length > 0
    })
    return text
}
