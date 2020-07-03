/**
 * title: 500
 */
import { Exception } from '@/components';

export default function () {
    return (
        <Exception
            type={500}
            backText={'返回首页'}
            title={'500'}
            desc={'抱歉，服务器出错了'}
        />
    );
}