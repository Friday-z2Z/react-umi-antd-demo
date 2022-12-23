import { Message } from 'antd';
import router from 'umi/router';
import * as api from '@/services/global';
import { setToken, getToken, setTimeStamp, removeToken } from "@/utils/auth";
// import { sysDefultPage } from '@/config/platform.config';

export default {
    namespace: 'global',
    state: {
        token: '',
        user:{}
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
                    pathname: '/'
                })
                return
            }
        },
        //路由监听
        // setupHistory({ dispatch, history }) {
        //     history.listen(location => {
        //         const { pathname } = location;
        //         console.log('location', location);
        //         if (pathname.substring(1)) {
        //             dispatch({
        //                 type: 'cacheRoute',
        //                 payload: {
        //                     location,
        //                 },
        //             });
        //         }
        //     });
        // },
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
            // 到主页
            router.push('/')
        },
        *logout(_, { put, call }) {
            yield call(api.logout);
            
            yield put({
                type: 'clearInfo',
            });
            
        },
        *getUserInfo(_, { put, call }) {
            const { user } = yield call(api.getUserInfo, { token: getToken() });
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
