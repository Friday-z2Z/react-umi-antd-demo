import KeepAlive from 'react-activation';
/**
 * 判断路由是否可以访问 noMatch 404页面
 */

export default props => {
    // route: { routes }
    const {
        children,
        location: { pathname },
        cacheRoutes,
    } = props;
    // const [res] = routes.filter(item => item.path === pathname);
    // return res ? children : noMatch;
    
    // when: boolean: 缓存tab中存在的时候缓存
    return (
        <KeepAlive
            cacheKey={pathname}
            id={pathname}
            saveScrollPosition="screen"
            when={cacheRoutes.filter(item => item.pathname === pathname).length > 0}
        >
            {children}
        </KeepAlive>
    );
};
