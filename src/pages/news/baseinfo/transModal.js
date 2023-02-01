import React from 'react';
import { Transfer } from 'antd';
import { BaseModal } from '@/components';

class TransModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedKeys: [],
            targetKeys: props.dataSource.map(item => item.key)
        }
    }

    handleChange = (nextTargetKeys, direction, moveKeys) => {
        if (direction === 'right') {
            const originKeys = this.props.dataSource.map(item => item.key)
            const _moveKeys = originKeys.filter(item => moveKeys.includes(item))
            this.setState({ targetKeys: [...this.state.targetKeys, ..._moveKeys] });
        } else {
            this.setState({ targetKeys: nextTargetKeys });
        }
    };

    handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
    };

    handleOk = () => {
        this.props.onOk(this.state.targetKeys)
    }

    render() {
        const { dataSource } = this.props
        const { targetKeys, selectedKeys } = this.state
        return (
            <BaseModal {...this.props} onOk={this.handleOk} width='auto' title="自定义列" destroyOnClose>
                <Transfer
                    dataSource={dataSource}
                    titles={['原始列', '显示列']}
                    render={item => item.title}
                    targetKeys={targetKeys}
                    selectedKeys={selectedKeys}
                    onChange={this.handleChange}
                    onSelectChange={this.handleSelectChange}
                    listStyle={{width: 300, height: 300}}
                />
            </BaseModal>
        );
    }
}

export default TransModal;
