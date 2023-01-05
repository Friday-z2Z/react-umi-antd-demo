import PropTypes from 'prop-types';
import { iconUrl } from '@/config/platform.config';

import { Icon } from 'antd';

function Index(props) {
    const { type = 'bars' } = props;
    // if (type.indexOf("anticon") > -1) {
    //     const MyIcon = Icon.createFromIconfontCN({
    //         scriptUrl: iconUrl, // 在 iconfont.cn 上生成
    //     });
    //     return (
    //         <MyIcon {...props} />
    //     );
    // } else {

    //     return (
    //         <Icon {...props} />
    //     );
    // }


    // 统一使用iconfont.js  type在config中管理
    const MyIcon = Icon.createFromIconfontCN({
        scriptUrl: iconUrl, // 在 iconfont.cn 上生成
    });
    return <MyIcon style={{ fontSize: '20px' }} {...props} type={'anticon-' + type} />;
}
export default Index;
Index.propTypes = {
    //icon类型
    type: PropTypes.string,
    //icon 样式
    style: PropTypes.object,
    //是否加载中
    spin: PropTypes.bool,
};
