import * as API_MENu from '@/services/sys/menu';
import { flattenMenuToTree } from '@/utils/_';

export default {
    namespace:'sysMenu',
    state:{
        treeData:[], // table 数据源
        flattenMenuData: []
    },
    subscriptions:{},
    effects:{
        *getSelectTreeData(_, { call, put }) {
            const { menuList } = yield call(API_MENu.getSelectTree)

            yield put({
                type:'save',
                payload:{
                    treeData: flattenMenuToTree(menuList, -1),
                    flattenMenuData: menuList
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