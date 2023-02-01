/**
 * title: 定时任务
 */

import React from 'react';
import { BasePanel, BaseTable, BasePagination } from '@/components';
import { Modal, Form, Input, Button, Table, Divider, Tag, message } from 'antd';
import * as API_SCHEDULE from '@/services/job/schedule';
import UpdateModal from './updateModal';
import LogModal from './logModal'
const { confirm } = Modal;
const { Column } = Table;

class Schedule extends React.Component {
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
        API_SCHEDULE.getList(params).then(res => {
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
        const that = this;
        const jobIds = rows.map(item => item.jobId);
        confirm({
            title: `确定对【id=${jobIds.join(',')}】进行【删除】操作吗？`,
            centered: true,
            onOk() {
                API_SCHEDULE.del({ jobIds }).then(() => {
					message.success('删除成功')
                    that.handleGetList();
                });
            },
        });
    };

	handlePause = rows => {
        const that = this;
        const jobIds = rows.map(item => item.jobId);
        confirm({
            title: `确定对【id=${jobIds.join(',')}】进行【暂停】操作吗？`,
            centered: true,
            onOk() {
                API_SCHEDULE.pause(jobIds).then(() => {
					message.success('暂停成功')
                    that.handleGetList();
                });
            },
        });
    };

	handleResume = rows => {
        const that = this;
        const jobIds = rows.map(item => item.jobId);
        confirm({
            title: `确定对【id=${jobIds.join(',')}】进行【恢复】操作吗？`,
            centered: true,
            onOk() {
                API_SCHEDULE.resume(jobIds).then(() => {
					message.success('恢复成功')
                    that.handleGetList();
                });
            },
        });
    };

	handleRun = rows => {
        const that = this;
        const jobIds = rows.map(item => item.jobId);
        confirm({
            title: `确定对【id=${jobIds.join(',')}】进行【立即执行】操作吗？`,
            centered: true,
            onOk() {
                API_SCHEDULE.run(jobIds).then(() => {
					message.success('执行成功')
                    that.handleGetList();
                });
            },
        });
    };

    handleOk = async () => {
        const values = await this.updateModal.handleSubmit();
        API_SCHEDULE.update(values).then(() => {
			message.success(`${values.jobId?'修改':'新增'}成功`)
            this.handleCancel();
            this.handleGetList();
        });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

	handleLogCancel = () => {
		this.setState({ logVisible: false });
	}

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
			logVisible,
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
                            {getFieldDecorator('beanName')(
                                <Input allowClear placeholder="bean名称" />,
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
						<Form.Item>
                            <Button
                                type="danger"
                                disabled={selectedRows.length <= 0}
                                onClick={() => this.handlePause(selectedRows)}
                            >
                                批量暂停
                            </Button>
                        </Form.Item>
						<Form.Item>
                            <Button
                                type="danger"
                                disabled={selectedRows.length <= 0}
                                onClick={() => this.handleResume(selectedRows)}
                            >
                                批量恢复
                            </Button>
                        </Form.Item>
						<Form.Item>
                            <Button
                                type="danger"
                                disabled={selectedRows.length <= 0}
                                onClick={() => this.handleRun(selectedRows)}
                            >
                                批量立即执行
                            </Button>
                        </Form.Item>
						<Form.Item>
                            <Button type="primary" onClick={() => { this.setState({logVisible: true}) }}>
                                日志列表
                            </Button>
                        </Form.Item>
                    </Form>
                </BasePanel>
                <BaseTable
                    loading={loading}
                    dataSource={data}
                    rowKey="jobId"
                    pagination={false}
                    extraHeight={52}
                    rowSelection={rowSelection}
                >
                    <Column title="ID" width="100px" dataIndex="jobId" key="jobId" />
                    <Column
                        title="bean名称"
                        align="center"
                        dataIndex="beanName"
                        key="beanName"
						width="180px"
                    />
                    <Column
                        title="参数"
                        align="center"
                        dataIndex="params"
                        key="params"
                        ellipsis={true}
                    />
                    <Column
                        title="cron表达式"
                        align="center"
                        dataIndex="cronExpression"
                        key="cronExpression"
						width="180px"
                    />
					<Column
                        title="备注"
                        align="center"
                        dataIndex="remark"
                        key="remark"
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
								<Tag color={text ? '#ff4d4f' : '#87d068'}>{ text ? '暂停' : '正常' }</Tag>
							</span>
						)}
                    />
                    <Column
                        title="操作"
                        align="center"
                        key="action"
                        width="300px"
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
                                <Divider type="vertical" />
								<Button
                                    type="link"
                                    onClick={e => this.handlePause([record], e)}
                                >
                                    暂停
                                </Button>
                                <Divider type="vertical" />
								<Button
                                    type="link"
                                    onClick={e => this.handleResume([record], e)}
                                >
                                    恢复
                                </Button>
                                <Divider type="vertical" />
								<Button
                                    type="link"
                                    onClick={e => this.handleRun([record], e)}
                                >
                                    立即执行
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
				<LogModal
					maskClosable={false}
					visible={logVisible}
					footer={null}
					onCancel={this.handleLogCancel}
				></LogModal>
            </>
        );
    }
}
const ScheduleWrapper = Form.create()(Schedule);
export default ScheduleWrapper;
