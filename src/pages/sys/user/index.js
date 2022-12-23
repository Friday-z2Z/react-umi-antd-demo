/**
 * title: 用户管理
 */

import React from 'react';
import { BasePanel, BaseTable, BasePagination } from '@/components';
import { Modal, Form, Input, Button, Table, Divider, Tag } from 'antd';
import * as API_USER from '@/services/sys/user';
// import UpdateModal from './updateModal';
const { confirm } = Modal;
const { Column } = Table;

class Config extends React.Component {
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
        };
    }

    componentDidMount() {
        this.handleGetList();
    }

    handleGetList = (values = {}) => {
        this.setState({
            loading: true,
        });
        API_USER.getList({ ...this.state.dataForm, ...values }).then(res => {
            this.setState({
                data: res.page.list || [],
                total: res.page.totalCount || 0,
                loading: false,
            });
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

    beforeOpen = (record = {}) => {
        this.setState({
            modalForm: { ...record },
            visible: true,
        });
    };

    handleDel = rows => {
        // const that = this;
        const jobIds = rows.map(item => item.jobId);
        confirm({
            title: `确定对【id=${jobIds.join(',')}】进行【删除】操作吗？`,
            centered: true,
            onOk() {
                // API_USER.del({ jobIds }).then(() => {
                //     message.success('删除成功');
                //     that.handleGetList();
                // });
            },
        });
    };

    handleOk = async () => {
        // const values = await this.updateModal.handleSubmit();
        // API_USER.update(values).then(res => {
        //     message.success(`${values.jobId ? '修改' : '新增'}成功`);
        //     this.handleCancel();
        //     this.handleGetList();
        // });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    render() {
        const rowSelection = {
            onChange: (selectedRows) => {
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
            // visible,
            // logVisible,
            total,
            loading,
            selectedRows,
            // modalForm,
            dataForm: { pageSize, page },
        } = this.state;
        return (
            <>
                <BasePanel>
                    <Form layout="inline" onSubmit={this.handleSubmit} autoComplete="off">
                        <Form.Item>
                            {getFieldDecorator('username')(
                                <Input allowClear placeholder="用户名" />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit">查 询</Button>
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
                    rowKey="userId"
                    pagination={false}
                    extraHeight={52}
                    rowSelection={rowSelection}
                >
                    <Column title="ID" width="100px" dataIndex="userId" key="userId" />
                    <Column
                        title="用户名"
                        align="center"
                        dataIndex="username"
                        key="username"
                        width="150px"
                    />
                    <Column
                        title="邮箱"
                        align="center"
                        dataIndex="email"
                        key="email"
                        ellipsis={true}
                    />
                    <Column
                        title="手机号"
                        align="center"
                        dataIndex="mobile"
                        key="mobile"
                        ellipsis={true}
                    />
                    <Column
                        title="状态"
                        align="center"
                        dataIndex="status"
                        key="status"
                        width="100px"
                        render={(text, record) => (
                            <span>
                                <Tag color={text ? '#87d068' : '#ff4d4f'}>
                                    {text ? '正常' : '禁用'}
                                </Tag>
                            </span>
                        )}
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
                        width="150px"
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
                {/* <UpdateModal
                    maskClosable={false}
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    onRef={node => (this.updateModal = node)}
                    dataForm={modalForm}
                ></UpdateModal> */}
            </>
        );
    }
}
const ConfigWrapper = Form.create()(Config);
export default ConfigWrapper;
