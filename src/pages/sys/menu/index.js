/**
 * title: 菜单管理
 */

import React from 'react';
import { connect } from 'dva';
import { BasePanel, BaseTable, BaseIcon } from '@/components';
import { Button, Table, Divider, Tag, message, Modal } from 'antd';
import * as API_MENU from '@/services/sys/menu';
import { flattenMenuToTree } from '@/utils/_';
import UpdateModal from './updateModal';
import styles from './index.less'
// import Context from '@/layouts/Context';

const { Column } = Table;

class MenuConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [], // 配置菜单
            visible: false,
            targetMenu: {}, // 当前正在修改的菜单
            modalForm: {}, // 修改的当前菜单
            loading: false
        };
    }

    // 上下文
    // static contextType = Context

    static defaultProps = {
        modalForm: {
            type: 1
        }, // 修改的当前菜单
    }

    componentDidMount() {
        this.getMenuList()
    }

    beforeOpen = (record={menuId: 0}) => {
        this.setState({
            modalForm: {...this.props.modalForm, ...record}
        })
        this.props
            .dispatch({
                type: 'sysMenu/getSelectTreeData',
            })
            .then(() => {
                this.setState({
                    visible: true,
                });
                if(record.menuId) {
                    // 设置默认选中node
                    this.updateModal.setSelectNode()
                }
            });
    };

    handleOk = async() => {
        const values = await this.updateModal.handleSubmit();
        API_MENU.menuUpdate(values).then(()=>{
            message.success(`${values.menuId === 0?'新增':'修改'}成功`)
            this.handleCancel()
            this.getMenuList()
        })
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    getMenuList = () => {
        this.setState({
            loading: true
        })
        API_MENU.getList().then(res => {
            const { data } = res;
            const listData = flattenMenuToTree(data, 0);
            this.setState({
                data: listData,
                loading: false
            });
        });
    }

    handleDel = record => {
        const that = this;
        Modal.confirm({
            title: `确定对【id=${record.menuId}】进行【删除】操作吗？`,
            centered: true,
            onOk() {
                API_MENU.del(record.menuId).then(() => {
					message.success('删除成功')
                    that.getMenuList();
                });
            },
        });
    }

    render() {
        const { data, visible, loading, modalForm } = this.state;
        return (
            <>
                <BasePanel>
                    <Button type="primary" onClick={()=>this.beforeOpen()}>
                        新增
                    </Button>
                </BasePanel>
                <BaseTable
                    loading={loading}
                    dataSource={data}
                    rowKey="menuId"
                    pagination={false}
                >
                    <Column title="名称" width="200px" dataIndex="name" key="name" />
                    <Column title="上级菜单" align="center" width="150px" dataIndex="parentName" key="parentName" />
                    <Column
                        title="图标"
                        align="center"
                        width="150px"
                        dataIndex="icon"
                        key="icon"
                        render={(text, record) => <BaseIcon type={record.icon} />}
                    />
                    <Column
                        title="类型"
                        align="center"
                        width="120px"
                        dataIndex="type"
                        key="type"
                        render={text => {
                            return (
                                <Tag
                                    className={[styles.tag, styles['tag-' + text]]}
                                >
                                    {text === 0 ? '目录' : text === 1 ? '菜单' : '按钮'}
                                </Tag>
                            );
                        }}
                    />
                    <Column title="排序号" align="center" width="100px" dataIndex="orderNum" key="orderNum" />
                    <Column title="菜单URL" align="center" ellipsis={true} dataIndex="url" key="url" />
                    <Column title="授权标识" align="center" ellipsis={true} dataIndex="perms" key="perms" />
                    <Column
                        title="操作"
                        align="center"
                        key="action"
                        width="150px"
                        render={(text, record) => (
                            <span>
                                <Button type="link" onClick={(e)=>this.beforeOpen(record, e)}>修改</Button>
                                <Divider type="vertical" />
                                <Button type="link" style={{color: '#ff4d4f'}} onClick={e => this.handleDel(record, e)}>删除</Button>
                            </span>
                        )}
                    />
                </BaseTable>
                <UpdateModal
                    maskClosable={false}
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    onRef={node => (this.updateModal = node)}
                    dataForm={modalForm}
                ></UpdateModal>
            </>
        );
    }
}
// MenuConfig.contextType = Context
export default connect(({ sysMenu }) => ({
    ...sysMenu,
}))(MenuConfig);
