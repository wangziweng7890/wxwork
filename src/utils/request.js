import axios from "axios"
import qs from "qs"
import router from '../router'

import { showFailToast } from 'vant'

const http = axios.create({
    baseURL: '/api',
    timeout: 50000
})

// 数据请求拦截
http.interceptors.request.use((config) => {
    axios.defaults.headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    // 全局loading
    if (!config.hideLoading) {
        store.dispatch('onLoading', true)
    }
    // // 缓存取token
    // let token = store.state.token
    // config.headers["token"] = token
    // post，put请求前处理
    if ((config.method.toLowerCase() === 'post' || config.method.toLowerCase() === 'put') && config.data &&
        config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        config.data = qs.stringify(config.data)
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

// 返回响应数据拦截
http.interceptors.response.use((res) => {
    // 全局loading
    // store.dispatch('onLoading', false)
    // if (!store.state.isLoading) {
        if (res.data.code===401) {
            showFailToast({ message: '身份验证失败,请重新登陆', icon: 'cross' })
            return
        }
        const data = res.data
        if (res.status === 200 && data.code === 200) {
            return Promise.resolve(data)
        }
        if (res.status === 200 && (res.data.code == 401 || res.data.code == 403)) {
            showFailToast({ message: '身份验证失败,请重新登陆', icon: 'cross' })
            // 清空缓存
            // localStorage.clear()
            router.push({
                path: "/login"
            })
            return
        }
        // 其他状态码
        return showFailToast({ message: data.msg, icon: 'cross' })
    // }
}, (error) => {
    // 全局loading
    // store.dispatch('onLoading', false)
    // if (!store.state.isLoading) {
        let msg = ''
        if (error.response.status) {
            switch (error.response.status) {
                case 400:
                    msg = '400 Bad！'
                    break
                case 500:
                    if (error.response.data) {
                        msg = error.response.data.msg
                        if (error.response.data.code == 401) {
                            router.push({
                                path: "/login"
                            })
                        }
                    } else {
                        msg = '服务器内部错误！'
                    }
                    break
                default:
                    msg = '未知错误！'
                    break
        }
        }
        showFailToast({ message: msg, icon: 'cross' })
        return Promise.reject(error)
    // }
  })

  export default http