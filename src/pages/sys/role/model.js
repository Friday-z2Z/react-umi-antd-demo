import * as API_ROLE from '@/services/sys/role';
import { flattenMenuToTree } from '@/utils/_';

export default {
    namespace:'role',
    state:{
        treeData:[],
        checkedKeys: [],
        defaultId: -666666
    },
    subscriptions:{},
    effects:{
        *getMenu(_, { call, put }) {
            const { data } = yield call(API_ROLE.getMenuList)
            yield put({
                type:'save',
                payload:{
                    treeData: flattenMenuToTree(data, 0)
                }
            })
        },
        *getCheckedIds({ payload }, { call, put, select }) {
            let { defaultId } = yield select(({ role }) => role);
            let L = []
            if (payload.roleId) {
                const { role: { menuIdList = [] } } = yield call(API_ROLE.getCheckedIds, payload.roleId)
                L = menuIdList
            }
            L.splice(L.indexOf(defaultId), 1)
            L = L.map(item => item.toString())
            yield put({
                type:'save',
                payload:{
                    checkedKeys: L
                }
            })
        },
        *setCheckedIds({ payload:{ checkedKeys = [] } }, { call, put }) {
            yield put({
                type:'save',
                payload:{
                    checkedKeys
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