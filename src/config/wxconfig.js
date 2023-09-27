/*
 * @Author: Autumn.again
 * @Date: 2023-09-12 17:15:47
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-27 19:27:33
 * @FilePath: \workwexin-h5-sidebar\src\config\wxconfig.js
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
 */

import { getWorkWechatConfig } from '@/api/common'
import { getAgentid } from './app'
import * as wx from '@wecom/jssdk'

// 企业微信jsdk授权
export const agentConfig = (jsApiList) => {
    return new Promise(async (resolve, reject) => {
        const agentId = getAgentid()
        wx.register({
            corpId: import.meta.env.VITE_APPID, // 必填，企业微信的corpid，必须与当前登录的企业一致
            agentId, // 必填，企业微信的应用id （e.g. 1000247）
            jsApiList: jsApiList, //必填
            async getAgentConfigSignature() {
                // console.log(jsApiList, agentId, corpId, import.meta.env.VITE_APPID);
                const { data: { config } } = await getWorkWechatConfig({ url: location.href, agentid: getAgentid() })
                return {
                    timestamp: config.timestamp, // 必填，生成签名的时间戳
                    nonceStr: config.nonceStr, // 必填，生成签名的随机串
                    signature: config.signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
                }
                // if (import.meta.env.VITE_ENV !== 'dev') {
                //     const { data: { config } } = await getWorkWechatConfig({ url: location.href  })
                //     return {
                //         timestamp: config.timestamp, // 必填，生成签名的时间戳
                //         nonceStr: config.nonceStr, // 必填，生成签名的随机串
                //         signature: config.signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
                //     }
                // } else {
                //     // 开发时
                //     // 这里签名一直校验失败，等后面再看把
                //     const JSAPI_TICKET = 'sM4AOVdWfPE4DxkXGEs8VMCPGGVi4C3VM0P37wVUCFvkVAy_90u5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcHKP7qg '
                //     const data = wx.getSignature(JSAPI_TICKET)
                //     return data
                // }
            },
            onAgentConfigSuccess: (res) => {
                // 授权jsdk成功
                console.log('授权jsdk成功:', res)
                resolve()
            },
            onAgentConfigFail: (res) => {
                console.log("agent config 失败: ", res);
                //alert("agentId失败:" + JSON.stringify(res));
                reject()
                if (res.errMsg.indexOf("function not exist") > -1) {
                    alert("版本过低请升级")
                }
            }
        })
    })
}
