import PropTypes from 'prop-types';
import { iconUrl } from '@/config/platform.config';

import { Icon } from 'antd';

function Index(props) {
    const { type = "bars", style = {}, spin = false } = props;
    if (type.indexOf("icon") > -1) {
        const MyIcon = Icon.createFromIconfontCN({
            scriptUrl: iconUrl, // 在 iconfont.cn 上生成
        });
        return (
            <MyIcon type={type} style={style} />
        );
    } else {

        return (
            <Icon type={type} style={style} spin={spin} />
        );
    }
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