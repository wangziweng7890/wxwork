// 页面加载初始化
import initStorage from './proxyLocalStorage';
import { setAgentid } from './app'
import { agentid } from './constant';

export default function init() {
    // localstorage隔离
    initStorage()
    // 首次跳转缓存 agentid
    const id = new URLSearchParams(location.search).get(agentid)
    id && setAgentid(id)
}

