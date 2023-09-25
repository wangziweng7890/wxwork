export function copy(content) {
    const textarea = document.createElement('textarea')
    textarea.readOnly = true
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    // 将要 copy 的值赋给 textarea 标签的 value 属性
    textarea.value = content
    // 将 textarea 插入到 body 中
    document.body.appendChild(textarea)
    // 选中值并复制
    textarea.select()
    textarea.setSelectionRange(0, textarea.value.length)
    const result = document.execCommand('copy')
    document.body.removeChild(textarea)
    return result
}