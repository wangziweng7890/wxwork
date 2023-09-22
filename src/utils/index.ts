/**
 * @description:  根据文件url获取后缀名，不带小数点
 * @param {string} fileUrl 文件地址
 */
export const getSuffixName = (fileUrl: string) => {
    const queryIndex = fileUrl.indexOf('?') // 获取链接是否包含?参数
    fileUrl = queryIndex > 0 ? fileUrl.substring(0, queryIndex) : fileUrl // 如果包含?，去除?后面的参数
    const startIndex = fileUrl.lastIndexOf('.') + 1
    const fileType = fileUrl.substring(startIndex, fileUrl.length)
    return fileType.toLowerCase()
}