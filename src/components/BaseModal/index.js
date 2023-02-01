import React from 'react';
import { Modal } from 'antd';
import styles from './index.less'

class BaseModal extends React.Component {
    render() {
        const { fullscreen } = this.props
        return (
            <Modal {...this.props} centered maskClosable={false} className={fullscreen && styles.fullscreen}>
                {this.props.children}
            </Modal>
        );
    }
}

export default BaseModal;
