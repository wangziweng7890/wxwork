import axios from "axios";
import qs from "qs";
import router from "../router";
import { showToast } from "vant";
import "vant/es/toast/style";
import { useUserStore } from "@/stores/modules/user";
import { useCommonStoreInfo } from "@/stores/modules/common";
const useCommonStore = useCommonStoreInfo();
const isLoading = useCommonStore.getLoading;

// 身份验证失败
const toast = (msg) => {
    const userStore = useUserStore()
    userStore.clear()
    showToast(
        {
            message: msg,
            icon: 'cross',
        }
    )
    setTimeout(() => {
        router.replace({
            path: "/login",
            query: {
                redirect_uri: encodeURIComponent(location.pathname + location.search)
            }
        })
    }, 300);
}

function requestHook(config, isDwp) {
    !isDwp && (axios.defaults.headers = {
        "Content-Type": "application/x-www-form-urlencoded",
    });

    // 全局loading
    if (!config.hideLoading) {
        useCommonStore.setLoading(true);
    }
    // 缓存取token
    const userStore = useUserStore();
    config.headers["App"] = 'galaxy-admin'
    const dwpToken = userStore.getDwpToken || JSON.parse(localStorage.getItem('user') || '{}')?.dwpToken
    config.headers["Token"] = config.headers["Token"] || (isDwp ? dwpToken : userStore.getToken);
    // post，put请求前处理
    if (
        (config.method.toLowerCase() === "post" ||
            config.method.toLowerCase() === "put") &&
        config.data &&
        config.headers["Content-Type"] === "application/x-www-form-urlencoded"
    ) {
        config.data = qs.stringify(config.data);
    }
    return config;
}

function responseHook(res) {
    // 全局loading
    useCommonStore.setLoading(false);
    if (res.data.code === 401) {
        toast("身份验证失败,请重新登陆");
        return;
    }
    const data = res.data;
    if (res.status === 200 && data.code === 200) {
        return Promise.resolve(data);
    }
    if (
        res.status === 200 &&
        (res.data.code == 401 || res.data.code == 403)
    ) {
        toast("身份验证失败,请重新登陆");
        return;
    }
    // 其他状态码
    showToast({ message: data.message || data.msg, icon: "cross" });
    return Promise.reject(res);
}

function responseError(error) {
    // 全局loading
    useCommonStore.setLoading(false);
    let msg = "";
    if (error.response.status) {
        switch (error.response.status) {
            case 400:
                msg = "400 Bad！";
                break;
            case 500:
                if (error.response.data) {
                    msg = error.response.data.msg;
                    if (error.response.data.code == 401) {
                        return toast("身份验证失败,请重新登陆");
                    }
                } else {
                    msg = "服务器内部错误！";
                }
                break;
            case 401:
                return toast("身份验证失败,请重新登陆");
            case 403:
                return toast("身份验证失败,请重新登陆");
            default:
                msg = "未知错误！";
                break;
        }
    }
    showToast({ message: msg, icon: "cross" });
    return Promise.reject(error);
}


function createHttp(baseURL, isDwp) {
    const http = axios.create({
        baseURL,
        timeout: 50000,
    });

    // 数据请求拦截
    http.interceptors.request.use(
        (config) => requestHook(config, isDwp),
        (error) => {
            return Promise.reject(error);
        }
    );

    // 返回响应数据拦截
    http.interceptors.response.use(
        responseHook,
        responseError
    );
    return http
}


export default createHttp(import.meta.env.VITE_API_BASEPATH);  // 仅仅用来授权

export const http = createHttp(import.meta.env.VITE_DWP_URL, true); // 用来业务
