/*
 * @FilePath: /Document-System/src/common/ali-oss.ts
 * @Description:
 */
import OSS from 'ali-oss'
import SparkMD5 from 'spark-md5'
import { getOssConfig } from '@/api/common'
import { getSuffixName } from '@/utils'

interface AliyunOssConfig {
    region: string
    accessKeyId: string
    accessKeySecret: string
    bucket: string
    SecurityToken: string
    expiration: string | Date
}

interface IFileInfo {
    name: string
    res: {
        status: number
        size: number
        data: any
        requestUrls: string[]
        [key: string]: any
    }
    url: string
    oriName: string
    type: string
    uid: number
}

interface IFileType extends File {
    uid?: number
}

interface IFileHash {
    buffer: string | ArrayBuffer
    HASH: string
    suffix: any
    filename: string
}

// 定义阿里云OSS所需的配置信息接口
class AliyunOssService {
    private client: OSS // OSS客户端实例
    // private tempCredentials?: {
    //     // 临时密钥信息
    //     AccessKeyId: string
    //     AccessKeySecret: string
    //     SecurityToken: string
    //     Expiration: Date
    // }

    // 构造函数，传入阿里云OSS的配置信息
    constructor(private readonly config: AliyunOssConfig) {
        this.client = new OSS({
            region: this.config.region,
            accessKeyId: this.config.accessKeyId,
            accessKeySecret: this.config.accessKeySecret,
            bucket: this.config.bucket,
            stsToken: this.config.SecurityToken,
            refreshSTSToken: true, // 启用自动刷新
            refreshSTSTokenInterval: 3000, // 每隔 3 秒刷新一次凭证
        })
    }

    // (简单上传)上传文件到阿里云OSS，返回文件URL
    public async uploadFile({ file }): Promise<IFileInfo> {
        try {
            const suffix = getSuffixName(file.name)

            // 获取文件hash值
            const { HASH } = await AliyunOssService.getFileHash(file)

            // 构建文件存储路径
            const newFilePath = `document/${import.meta.env.VITE_APP_ENV}/${HASH}.${suffix}`
            // 上传文件
            const res = await this.client.put(newFilePath, file, {
                timeout: 10 * 60 * 1000, // 设置超时时间10分钟
            })
            return { ...res, oriName: file.name, type: file.type }
        }
        catch (error) {
            throw new Error(error)
        }
    }

    // 从后台数据获取阿里云OSS的配置信息创建服务实例
    public static async createFromBackend(): Promise<AliyunOssService> {
        const { data } = await getOssConfig()
        const ossConfig: AliyunOssConfig = {
            region: data.region,
            accessKeyId: data.access_key_id,
            accessKeySecret: data.access_key_secret,
            bucket: data.bucket,
            SecurityToken: data.security_token,
            expiration: data.expiration,
        }
        const service = new AliyunOssService(ossConfig)

        return service
    }

    // 通过文件流获取文件的HASH值，用来定义传到oss中的文件不重复
    public static async getFileHash(file: IFileType): Promise<IFileHash> {
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.readAsArrayBuffer(file)
            reader.onload = (ev) => {
                const buffer = ev.target.result
                const spark = new SparkMD5.ArrayBuffer()
                spark.append(buffer)
                const HASH = spark.end()
                const suffix = getSuffixName(file.name)
                resolve({
                    buffer,
                    HASH,
                    suffix,
                    filename: `${HASH}.${suffix}`,
                })
            }
        })
    }
}

export default AliyunOssService
