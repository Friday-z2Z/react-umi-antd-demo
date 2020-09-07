import * as api from './service'

export default {
    namespace:'pageDModel',
    state:{
        pageD_dataSource:[], // table 数据源
    },
    subscriptions:{
        
    },
    effects:{
        *getPageDData({ payload }, { call, put, select }) {
            const data = yield call(api.getPageDData, payload)
            yield put({
                type:'save',
                payload:{
                    pageD_dataSource:data
                }
            })
        }
    },
    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        }
    }
}