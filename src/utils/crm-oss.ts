import { jsonp } from 'vue-jsonp'
import OSS from 'ali-oss'
import cryptoAES from './cryptoAES'

let oss = null
// 获取oss示例
export const fetchOss = async () => {
    console.log(oss, 'oss1')
    if (oss)
        return oss
    return jsonp(`${import.meta.env.VITE_APP_NODE_URL}/publicApi/getOssKey`).then((res) => {
        const date = new Date()
        const time = `${date.getFullYear()}${(date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1)}${date.getDate()}`
        const md5_key = `filename!@#$%/${time}`
        const md5_encrypt = cryptoAES.MD5(md5_key).substring(8, 24)
        const decryptData = cryptoAES.decrypt(res, md5_encrypt)
        // console.log(OSS, 'oss2', new OSS(JSON.parse(decryptData)))
        const data = JSON.parse(decryptData)
        data.region = 'oss-accelerate' // 走香港
        oss = new OSS(data)
        return oss
    })
}

export const createStorePath = (file) => {
    const pos = file.name.lastIndexOf('.')
    // 扩展名
    const fileExten = file.name.substring(pos, file.name.length)
    // 文件名称 不含扩展名
    const timestamp = new Date().getTime()
    // 文件存储路径 路径文件可自定义
    const storeAs = `document/${import.meta.env.VITE_APP_ENV}/files/${timestamp}${fileExten}`
    return storeAs
}

// 上传
export async function uploadFile(file) {
    const ossClient = await fetchOss()
    const storeAs = createStorePath(file)
    return ossClient.multipartUpload(storeAs, file).then(async (res) => {
        return { ...res, oriName: file.name, type: file.type, url: getPreviewUrl(res.name) }
    })
}

export function getPreviewUrl(name) {
    return `${import.meta.env.VITE_OSS_BASE_URL}${name}`
}
