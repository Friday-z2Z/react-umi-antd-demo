import { PureComponent } from 'react';
/**
 * 判断路由是否可以访问 noMatch 403页面
 */
export default class Authorized extends PureComponent {
    render() {
        const { children, noMatch, diffMenuData, location: { pathname } } = this.props;
        const [res] = diffMenuData.filter(item => item.link === pathname);
        return res ? noMatch : children;
    }
}