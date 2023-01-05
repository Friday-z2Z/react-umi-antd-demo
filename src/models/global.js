import { Message } from 'antd';
import router from 'umi/router';
import * as api from '@/services/global';
import { setToken, getToken, setTimeStamp, removeToken } from "@/utils/auth";
import { sysDefultPage } from '@/config/platform.config';

export default {
    namespace: 'global',
    state: {
        token: '',
        user: JSON.parse(localStorage.getItem('user') || '{}')
    },
    subscriptions: {
        // 限制全局提示最大条数为 1 条
        setMessage() {
            Message.config({
                maxCount: 1,
            });
        },
        watchToken({ dispatch }){
            if(!getToken()){
                Message.warning('请登录！')
                router.replace({
                    pathname: '/login'
                })
                return
            }
        },
    },
    effects: {
        *login({ payload }, { put, select, call }) {
            const { token = '' } = yield call(api.login, payload);
            setToken(token)
            setTimeStamp()
            yield put({
                type: 'save',
                payload: {
                    token
                },
            });
            yield put({
                type: 'getUserInfo'
            })
            // 到主页
            router.replace(sysDefultPage)
        },
        *logout(_, { put, call }) {
            yield call(api.logout);
            
            yield put({
                type: 'clearInfo',
            });
            
        },
        *getUserInfo(_, { put, call }) {
            const { user } = yield call(api.getUserInfo, { token: getToken() });
            localStorage.setItem('user', JSON.stringify(user))
            yield put({
                type: 'save',
                payload: {
                    user
                },
            });
        },
        *clearInfo(_, { put, call }) {
            removeToken()
            yield put({
                type: 'save',
                payload: {
                    token:'',
                    user:{}
                },
            });
            yield put({
                type: 'menu/clearCacheTab',
            });
            router.push({
                pathname: '/login'
            })
        },
    },
    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
    },
};
