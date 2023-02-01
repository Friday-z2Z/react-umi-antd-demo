import axios from 'axios'
import { message } from 'antd';
import { getTimeStamp, getToken } from "@/utils/auth";

const TimeOut = 36000;
const baseUrl = '/api';

// 创建一个 axios 实例
const service = axios.create({
    baseURL: baseUrl,                                       //添加在url前
    method: 'get',
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    timeout: 5000
})

// logout
const logout = function() {
    setTimeout(()=>{
        window.g_app._store.dispatch({
            type:'global/clearInfo'
        })
        window.g_app._store.dispatch({
            type:'menu/clearCacheTab'
        })
    },10)
}

// 添加请求拦截器
service.interceptors.request.use(
    config => {
        // 在请求发送之前做一些处理
        // 获取token
        // const token = util.cookies.get('token')
        // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
        // config.headers['X-Token'] = token

        const token = getToken();
        // 注入token
        if (token) {
            // 检查token是否超时
            if (IsCheckTimeOut()) {
                // 过期登出
                logout()
                message.warning('登录超时，请重新登录')
                // 提示token过期消息
                // return Promise.reject(new Error("token超时了"));
            }
            config.headers["token"] = `${token}`;
        }
        return config
    },
    error => {
        Promise.reject(error)
    }
)

// 添加响应拦截器
service.interceptors.response.use(
    response => {
        // dataAxios 是 axios 返回数据中的 data
        const dataAxios = response.data
        const { responseType } = response.config
        // 这个状态码是和后端约定的 根据开发修改
        const { code, msg } = dataAxios
        if (code === 0) {
            return dataAxios
        } else if (responseType === 'blob') {
            return response
        } else {
            message.error(msg)
            if (code === 401) {
                logout()
            }
            return Promise.reject(dataAxios)
        }
    }, 
    error => {
        if (error && error.response) {
            switch (error.response.status) {
                case 400: message.error('请求错误'); break
                case 401: 
                    message.error('token失效，请重新登录')
                    logout()
                ; break
                case 403: message.error('拒绝访问'); break
                case 404: message.error('请求地址出错'); break
                case 408: message.error('请求超时'); break
                case 500: message.error('服务器内部错误'); break
                case 501: message.error('服务未实现'); break
                case 502: message.error('网关错误'); break
                case 503: message.error('服务不可用'); break
                case 504: message.error('网关超时'); break
                case 505: message.error('HTTP版本不受支持'); break
                default: break
            }
        }
        return Promise.reject(error)
    }
)

// token是否超时
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
function IsCheckTimeOut() {
    // 当前时间戳
    var currentTime = Date.now();
    // 缓存时间戳
    var timeStamp = getTimeStamp();
    return (currentTime - timeStamp) / 1000 > TimeOut;
}

export default service