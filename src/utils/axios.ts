import axios from "axios";
import { Toast } from "zarm";

const MODE = import.meta.env.MODE // 环境变量

axios.defaults.baseURL = MODE == 'development' ? '/api' : 'http://api.chennick.wang'
axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['Authorization'] = `${sessionStorage.getItem('token') || null}`
axios.defaults.headers.post['Content-Type'] = 'application/json'

// 封装获取 cookie 的方法
function getCookie(name: string){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
    else
    return null;
}


axios.interceptors.request.use(req => {
    const token = sessionStorage.getItem('token');
    if (token) {
        req.headers['Authorization'] = token;
    }
    if (req.method === 'POST') {
        req.headers['x-csrf-token'] = getCookie("csrfToken");
    }
    return req;
})

axios.interceptors.response.use(res => {
    if (typeof res.data !== 'object') {
        Toast.show('服务端异常！')
        return Promise.reject(res)
    }
    if (res.data.code != 200) {
        if (res.data.msg) Toast.show(res.data.msg)
        if (res.data.code == 401) {
            window.location.href = '/login'
        }
        return Promise.reject(res.data)
    }

    return res.data
})

export default axios