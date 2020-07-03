import * as api from '../services';
import orginalData from '@/config/menu.config';
import { formatNumer, munesFilter, flattenMenu } from '@/utils/_';
import { menuPermission } from '@/config/platform.config';

export default {
    namespace: 'menu',
    state: {
        menusData: [],          //菜单
        flattenMenuData: [],    //有路由权限菜单一维数组
        diffMenuData: [],       //无路由权限菜单一维数组
    },
    subscriptions: {
        // setupHistory({ dispatch, history }) { // eslint-disable-line
        //     history.listen((location) => {
        //         const { pathname, query, state } = location;
        //         if (/^\/sys/.test(pathname)) {
                    
        //         }else{
                    
        //         }
        //     });
        // },
    },

    effects: {
        //参数为空用'_'标记
        *getMenuData(_, { call, put, select }) {
            let menusData = yield select(({ menu }) => menu.menuData);
            if (!(menusData && menusData.length > 0)) {
                const { data = [] } = yield call(api.getMenuData, {});
                //orginalData 原始菜单
                const { menusData, diffMenuData } = munesFilter(orginalData, data, menuPermission);
                //可在 munesFilter 中直接返回
                const flattenMenuData = flattenMenu(menusData);
                yield put({
                    type: 'save',
                    payload: {
                        menusData,
                        diffMenuData,
                        flattenMenuData
                    }
                });
            }
        }
    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
        clear(state) {
            return {
                ...state,
                menusData: [],
                flattenMenuData: [],
                diffMenuData: [],
            };
        }
    },

};
