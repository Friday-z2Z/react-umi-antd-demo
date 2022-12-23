import { PureComponent } from 'react';
/**
 * 判断路由是否可以访问 noMatch 403页面
 */
export default class Authorized extends PureComponent {
    render() {
        const {
            children,
            noMatch,
            route: { routes },
            location: { pathname },
        } = this.props;
        const [res] = routes.filter(item => item.path === pathname);
        return res ? children : noMatch;
    }
}
