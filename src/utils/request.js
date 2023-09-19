import axios from "axios"
import qs from "qs"
import router from '../router'
import { showToast } from 'vant'
import 'vant/es/toast/style'
import { useUserStore } from '@/stores/modules/user'
import { useCommonStoreInfo } from '@/stores/modules/common'
const useCommonStore = useCommonStoreInfo()
const isLoading = useCommonStore.getLoading

// 身份验证失败
const toast = (msg) => {
    const userStore = useUserStore()
    userStore.clear()
    showToast(
        { 
            message: msg,
            icon: 'cross',
            onClose:()=> {
                router.replace({
                    path: "/login",
                    query: {
                        redirect_uri: encodeURIComponent(location.href) 
                    }
                })
            }
        }
    )
}

const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASEPATH,
    timeout: 50000
})

// 数据请求拦截
http.interceptors.request.use((config) => {
    axios.defaults.headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    // 全局loading
    if (!config.hideLoading) {
        useCommonStore.setLoading(true)
    }
    // 缓存取token
    const userStore = useUserStore()
    config.headers["token"] = userStore.getToken
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
    useCommonStore.setLoading(false)
    if (!isLoading) {
        if (res.data.code===401) {
            toast('身份验证失败,请重新登陆')
            return
        }
        const data = res.data
        if (res.status === 200 && data.code === 200) {
            return Promise.resolve(data)
        }
        if (res.status === 200 && (res.data.code == 401 || res.data.code == 403)) {
            toast('身份验证失败,请重新登陆')
            return
        }
        // 其他状态码
        return showToast({ message: data.msg, icon: 'cross' })
    }
}, (error) => {
    // 全局loading
    useCommonStore.setLoading(false)
    if (!isLoading) {
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
                            toast('身份验证失败,请重新登陆')
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
        showToast({ message: msg, icon: 'cross' })
        return Promise.reject(error)
    }
  })

  export default http