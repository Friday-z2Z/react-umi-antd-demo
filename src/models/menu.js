import * as api from '@/services/menu';
import router from 'umi/router';
import { munesFilter, flattenMenu } from '@/utils/_';
import { menuPermission } from '@/config/platform.config';
export default {
    namespace: 'menu',
    state: {
        menusData: [],          // 菜单
        flattenMenuData: [],    // 扁平化菜单
        diffMenuData: [],       // 有权限的扁平化菜单 暂时用不到
        cacheRoutes: [],        // 所有显示的tab
        activeTabRoute: {},     // 当前tab
        openKeys: [],           // 展开的菜单keys
    },
    subscriptions: {
        setupHistory({ dispatch, history }) {
            history.listen(location => {
                // 获取存储的扁平化菜单 筛选与路由匹配的
                const cacheMenusData = JSON.parse(localStorage.getItem('menusData'))
                const matchRoute =  (cacheMenusData || []).filter(item => {
                    return item.pathname === location.pathname
                })[0] || location
                const { pathname, state } = matchRoute;
                console.log('location', location, 'matchRoute', matchRoute)
                if (pathname && pathname.substring(1) && state && state.key) {
                    dispatch({
                        type: 'cacheRoute',
                        payload: {
                            matchRoute,
                        },
                    });
                }
            });
        },
    },

    effects: {
        //参数为空用'_'标记
        *getMenuData(_, { call, put, select }) {
            // let menusData = yield select(({ menu }) => menu.menusData);
            // if (!(menusData && menusData.length > 0)) {
            const { menuList = []} = yield call(api.getMenuData, {});
            // 加入不在菜单的默认路由
            // menuList.unshift(sysDefultPage)
            //orginalData menu.config  自行配置的菜单
            // 以下根据具体需求修改
            const { menusData, diffMenuData } = munesFilter(menuList, menuPermission);
            //可在 munesFilter 中直接返回
            const flattenMenuData = flattenMenu(menuList);
            localStorage.setItem('menusData', JSON.stringify(flattenMenuData))
            yield put({
                type: 'save',
                payload: {
                    menusData,
                    diffMenuData,
                    flattenMenuData,
                }
            });
            // }
        },
        // 点击菜单路由变化的时候存储路由
        *cacheRoute({ payload: { matchRoute } }, { put, select }) {
            let { cacheRoutes, openKeys } = yield select(({ menu }) => menu);
            const index = cacheRoutes.findIndex(item => item.pathname === matchRoute.pathname);
            index < 0 && cacheRoutes.push(matchRoute);
            yield put({
                type: 'save',
                payload: {
                    cacheRoutes,
                    activeTabRoute: matchRoute,
                    openKeys: [...new Set([...openKeys, matchRoute.parentId.toString()])]
                },
            });
        },
        // 删除指定的tab 若没有指定则删除当前tab
        *removeTab({ payload }, { put, select }) {
            let { cacheRoutes, activeTabRoute: previousActiveTabRoute } = yield select(
                ({ menu }) => menu,
            );
            if (cacheRoutes.length <= 1) {
                return;
            }
            const newCacheRoutes = cacheRoutes.filter(
                item => item.pathname !== (payload?.removeRoute || previousActiveTabRoute).pathname,
            );
            const activeTabRoute = newCacheRoutes[newCacheRoutes.length - 1];
            yield put({
                type: 'save',
                payload: {
                    cacheRoutes: newCacheRoutes,
                    activeTabRoute,
                },
            });
            router.push(activeTabRoute);
        },
        *removeOthersTab(_, { put, select }) {
            let { activeTabRoute } = yield select(({ menu }) => menu);
            yield put({
                type: 'save',
                payload: {
                    cacheRoutes: [activeTabRoute],
                    activeTabRoute,
                    openKeys: [activeTabRoute.parentId.toString()]
                },
            });
        },
        *removeAllTab(_, { select, put }) {
            let { flattenMenuData } = yield select(
                ({ menu }) => menu,
            );
            // 设置菜单第一个是默认选中的
            const defaultRoute = flattenMenuData[0] || {}
            yield put({
                type: 'save',
                payload: {
                    cacheRoutes: [defaultRoute],
                    activeTabRoute: defaultRoute,
                    openKeys: [defaultRoute.parentId.toString()]
                },
            });
            router.push(defaultRoute);
        },
        *setCurrentTab({ payload: { currentRoute } }, { put }) {
            yield put({
                type: 'save',
                payload: {
                    activeTabRoute: currentRoute,
                },
            });
            router.push(currentRoute);
        },
        *setOpenKeys({ payload: { openKeys } }, { put }) {
            yield put({
                type: 'save',
                payload: {
                    openKeys,
                },
            });
        },
        *clearCacheTab(_, { put }) {
            localStorage.removeItem('menusData')
            yield put({
                type: 'save',
                payload: {
                    menusData: [],          // 菜单
                    flattenMenuData: [],    // 扁平化菜单
                    diffMenuData: [],       // 有权限的扁平化菜单 暂时用不到
                    cacheRoutes: [],        // 所有显示的tab
                    activeTabRoute: {},
                    openKeys: []
                },
            });
        },
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
