import { Exception } from '@/components';
import pathToRegexp from 'path-to-regexp';

export default function (props) {
    const { location: { pathname } } = props;
    //获取错误页面类型
    const [, code] = pathToRegexp('/exception/:code').exec(pathname);
    return (
        <Exception
            type={code}
            backText={'返回首页'}
            redirect={{ pathname: "/" }}
            title={code}
            // desc={'抱歉，你无权访问该页面'}
        />
    );
}
