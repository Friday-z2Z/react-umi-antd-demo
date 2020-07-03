/**
 * title: 404
 */
import { Exception } from '@/components';

export default function () {
    return (
        <Exception
            type={404}
            backText={'返回首页'}
            title={'404'}
            desc={'抱歉，你访问的页面不存在'}
        />
    );
}