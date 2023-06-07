// 企业微信jsdk授权
export const agentConfig = (data, callback) => {
    wx.agentConfig({
        beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
        // debug: true,
        corpid: 'ww12f0c60e7eb68bc3', // 必填，企业微信的corpid，必须与当前登录的企业一致
        agentid: '1000180', // 必填，企业微信的应用id （e.g. 1000247）
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
        jsApiList: [
            "sendChatMessage",
            "getContext",
            "openDefaultBrowser",
            "shareToExternalMoments",
            "getCurExternalContact",
            "openEnterpriseChat",
            "shareToExternalContact",
            "shareToExternalChat",
            "getCurExternalChat", //获取当前客户群的群ID
        ], //必填
        success: (res) => {
            // 授权jsdk成功
            console.log(res)
            callback()
        },
        fail: (res) => {
            console.log("agent config 失败: ", res);
            //alert("agentId失败:" + JSON.stringify(res));
            if (res.errMsg.indexOf("function not exist") > -1) {
                alert("版本过低请升级")
            }
        }
    })
}