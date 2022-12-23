import React from 'react';
import { Modal } from 'antd';

class BaseModal extends React.Component {
    render() {
        return (
            <Modal {...this.props} centered maskClosable={false}>
                {this.props.children}
            </Modal>
        );
    }
}

export default BaseModal;
