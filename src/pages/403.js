/**
 * title: 403
 */
import { Exception } from '@/components';

export default function () {
    return (
        <Exception
            type={403}
            backText={'返回首页'}
            title={'403'}
            desc={'抱歉，你无权访问该页面'}
        />
    );
}
