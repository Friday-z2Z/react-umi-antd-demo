// import * as api from '../services'
import { Message } from 'antd'


export default {
    namespace:"global",
    state:{
        
    },
    subscriptions: {
        // 限制全局提示最大条数为 1 条
        setMessage() {
            Message.config({
                maxCount:1
            })
        }
        //路由监听
        // setupHistory({ dispatch, history }) {
        //     history.listen((location) => {
        //         const { pathname, query, state } = location;
        //         if (/^\/sys/.test(pathname)) {
                    
        //         }
        //     });
        // },
    },
    effects:{
        
    },
    reducers:{
        save (state,action){
            return { ...state,...action.payload }
        },
        // clear(state) {
        //     return {
        //         ...state,
        //         userInfo: {},
        //         message: [],
        //         notification: undefined,
        //     };
        // }
    }
}