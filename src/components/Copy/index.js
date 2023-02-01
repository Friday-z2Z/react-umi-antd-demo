import { message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function (props) {

    function onCopy(text, result) {
        if (result) {
            message.success('复制成功')
        } else {
            message.error('复制失败请重试')
        }
    }

    return (
        <CopyToClipboard onCopy={onCopy} {...props}>{ props.children }</CopyToClipboard>
    )
}