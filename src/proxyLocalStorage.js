// 因为各个企微应用都用了同一个域名，所以需要进行隔离，防止串数据
// 这里使用一个前缀来区分
function proxyFn(prefix, fn) {
    return function (key, ...args) {
        const prefixKey = `${prefix}${key}`
        return fn.apply(this, [prefixKey, ...args])
    }
}

const prefix = new URLSearchParams(location.search).get('appid') || ''

localStorage.setItem = proxyFn(prefix, localStorage.setItem)
localStorage.getItem = proxyFn(prefix, localStorage.getItem)
localStorage.removeItem = proxyFn(prefix, localStorage.removeItem)