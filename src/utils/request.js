import axios from 'axios'
import router from 'umi/router';
import { message } from 'antd';

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

// 添加请求拦截器
service.interceptors.request.use(
    config => {
        // 在请求发送之前做一些处理
        // 获取token
        // const token = util.cookies.get('token')
        // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
        // config.headers['X-Token'] = token
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
        // 这个状态码是和后端约定的 根据开发修改
        const { code } = dataAxios
        if( code === undefined || code === null){
            return dataAxios
        } else {
            switch (code){
                case 0:
                    return dataAxios.data //和后台约定 || dataAxios.result
                default: 
                    return dataAxios.data
                    // throw new Error(dataAxios.resultDes) 
            }
        }
    }, 
    error => {
        if (error && error.response) {
            switch (error.response.status) {
                case 400: message.error('请求错误'); break
                case 401: message.error('未授权，请登录'); break
                case 403: message.error('拒绝访问'); break
                case 404: message.error('请求地址出错'); router.push('/404'); break
                case 408: message.error('请求超时'); break
                case 500: message.error('服务器内部错误'); router.push('/500'); break
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

export default service