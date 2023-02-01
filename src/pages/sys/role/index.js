/**
 * title: 角色管理
 * 
 */

import React from 'react';
import { connect } from 'dva';
import { BasePanel, BaseTable, BasePagination } from '@/components';
import { Modal, Form, Input, Button, Table, Divider, message } from 'antd';
import UpdateModal from './updateModal';
import * as API_ROLE from '@/services/sys/role';

const { confirm } = Modal;
const { Column } = Table;

class Role extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            total: 0,
            dataForm: {
                page: 1,
                pageSize: 10,
            },
            loading: false,
            modalForm: {},
            visible: false,
            selectedRows: [],
			logVisible: false
        };
    }

    componentDidMount() {
        this.handleGetList();
    }

    handleGetList = (values = {}) => {
        this.setState({
            loading: true,
        });
        const params = {
            ...this.state.dataForm, ...values
        }
        API_ROLE.getList(params).then(res => {
            this.setState({
                data: res.page.list || [],
                total: res.page.totalCount || 0,
                loading: false,
                dataForm: {
                    ...params
                }
            });
        });
    };

    beforeOpen = async(record = {}) => {
        await this.props.dispatch({
            type: 'role/getMenu'
        })
        await this.props.dispatch({
            type: 'role/getCheckedIds',
            payload: { roleId: record.roleId }
        })
        this.setState({
            modalForm: { ...record },
            visible: true,
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.handleGetList(values);
            }
        });
    };

    handlePageChange = (page, pageSize) => {
        this.setState(
            state => {
                return {
                    dataForm: Object.assign(state.dataForm, { page, pageSize }),
                };
            },
            () => {
                this.handleGetList();
            },
        );
    };

    handleShowSizeChange = (page, pageSize) => {
        this.setState(
            state => {
                return {
                    dataForm: Object.assign(state.dataForm, { page, pageSize }),
                };
            },
            () => {
                this.handleGetList();
            },
        );
    };

    handleDel = rows => {
        const that = this;
        const roleIds = rows.map(item => item.roleId);
        confirm({
            title: `确定对【id=${roleIds.join(',')}】进行【删除】操作吗？`,
            centered: true,
            onOk() {
                API_ROLE.del(roleIds).then(() => {
					message.success('删除成功')
                    that.handleGetList();
                });
            },
        });
    };

    handleOk = async () => {
        const values = await this.updateModal.handleSubmit();
        API_ROLE.update(values).then(() => {
			message.success(`${values.roleId?'修改':'新增'}成功`)
            this.handleCancel();
            this.handleGetList();
        });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    render() {
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRows,
                });
            },
        };
        const {
            form: { getFieldDecorator },
        } = this.props;
        const {
            data,
            visible,
            total,
            loading,
            selectedRows,
            modalForm,
            dataForm: { pageSize, page },
        } = this.state;
        return (
            <>
                <BasePanel>
                    <Form layout="inline" onSubmit={this.handleSubmit} autoComplete="off">
                        <Form.Item>
                            {getFieldDecorator('roleName')(
                                <Input allowClear placeholder="角色名称" />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit">
                                查 询
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={() => this.beforeOpen()}>
                                新 增
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="danger"
                                disabled={selectedRows.length <= 0}
                                onClick={() => this.handleDel(selectedRows)}
                            >
                                批量删除
                            </Button>
                        </Form.Item>
                    </Form>
                </BasePanel>
                <BaseTable
                    loading={loading}
                    dataSource={data}
                    rowKey="roleId"
                    pagination={false}
                    extraHeight={52}
                    rowSelection={rowSelection}
                >
                    <Column title="ID" width="100px" dataIndex="roleId" key="roleId" />
                    <Column
                        title="角色名称"
                        align="center"
                        dataIndex="roleName"
                        key="roleName"
						width="200px"
                    />
                    <Column
                        title="备注"
                        align="center"
                        dataIndex="remark"
                        key="remark"
                        ellipsis={true}
                    />
                    <Column
                        title="创建时间"
                        align="center"
                        dataIndex="createTime"
                        key="createTime"
                        ellipsis={true}
                    />
                    <Column
                        title="操作"
                        align="center"
                        key="action"
                        width="120px"
                        render={(text, record) => (
                            <span>
                                <Button type="link" onClick={e => this.beforeOpen(record, e)}>
                                    修改
                                </Button>
                                <Divider type="vertical" />
                                <Button
                                    type="link"
                                    style={{ color: '#ff4d4f' }}
                                    onClick={e => this.handleDel([record], e)}
                                >
                                    删除
                                </Button>
                            </span>
                        )}
                    />
                </BaseTable>
                <BasePagination
                    total={total}
                    current={page}
                    pageSize={pageSize}
                    onChange={this.handlePageChange}
                    onShowSizeChange={this.handleShowSizeChange}
                ></BasePagination>
                <UpdateModal 
					maskClosable={false}
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
					onRef={node => (this.updateModal = node)}
                    dataForm={modalForm}
				></UpdateModal>
            </>
        )
    }
}

const RoleWrapper = Form.create()(Role);
export default connect(({ role }) => ({
    ...role,
}))(RoleWrapper);