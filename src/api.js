// 引用axios
import axios from 'axios';
import qs from 'qs'

import Vue from 'vue'
import store from './store'
import router from './router'

// 创建axios实例
const service = axios.create({
    baseURL: 'https://mapi.qulaxin.com/', // api 的 base_url
    timeout: 10000 // 请求超时时间
})
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// request拦截器
service.interceptors.request.use(
    config => {
        return config
    },
    error => {
        console.log(error) // for debug
        Promise.reject(error)
    }
)

// response 拦截器
service.interceptors.response.use(
    response => {
        const res = response.data
        if (!res || res == null) {
            Vue.prototype.$toast("网络开小差了，请稍后重试");
            return Promise.reject(res)
        } else {
            if (res.ret) {
                return response.data.data
            } else if(res.type == "offline" || res.type == "session_invalid"){
                localStorage.clear()
                router.push({name: 'login', params: {type: res.type}});
                return false
            }else {
                Vue.prototype.$toast(res.error);
                return Promise.reject(res)
            }
        }

    },
    error => {
        console.log('err' + error) // for debug
        Vue.prototype.$toast("网络开小差了，请稍后重试");
        return Promise.reject(error)
    }
);

export default {
    get(url, params) {
        return new Promise((resolve, reject) => {
            store.commit('LoadingStatus', {isLoading: true})
            if (params) {
                url = url + '?' + qs.stringify(params);
            }
            service.get(url).then(res => {
                store.commit('LoadingStatus', {isLoading: false})
                resolve(res)
            }).catch(error => {
                store.commit('LoadingStatus', {isLoading: false})
                reject(error)
            })
        })
    },
    post(url, params = {}, isJsonType = 1) {
        return new Promise((resolve, reject) => {
            store.commit('LoadingStatus', {isLoading: true})
            service.post(url, (isJsonType === 1 ? qs.stringify(params) : params)).then(res => {
                store.commit('LoadingStatus', {isLoading: false})
                resolve(res)
            }).catch(error => {
                store.commit('LoadingStatus', {isLoading: false})
                reject(error)
            })
        })
    }
}
