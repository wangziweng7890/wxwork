// 用来获取企微香港配置

import { agentid, userid } from './constant'
// 获取应用id
export function getAgentid() {
    return sessionStorage.getItem(agentid)
}

// 设置应用id 
// 第一次从应用点进来会带，后面重新登录时，当前url不一定有参数
export function setAgentid(id) {
    sessionStorage.setItem(agentid, id)
}


