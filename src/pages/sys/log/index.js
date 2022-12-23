/**
 * title: 系统日志
 */

import React from 'react';
import { BasePanel, BaseTable, BasePagination } from '@/components';
import * as API_LOG from '@/services/sys/log';
import { Form, Input, Button, Table, Popover } from 'antd';

const { Column } = Table;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Log extends React.Component {

    constructor() {
        super();
        this.state = {
            data: [],
            total: 0,
            dataForm: {
                page: 1,
                pageSize: 10,
            },
			loading:false
        };
    }

    componentDidMount() {
        this.handleGetList();
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.handleGetList(values);
            }
        });
    };

    handleGetList = (values = {}) => {
		this.setState({
			loading: true
		})
        API_LOG.getList({ ...this.state.dataForm, ...values }).then(res => {
            this.setState({
                data: res.page.list || [],
                total: res.page.totalCount || 0,
				loading: false
            });
        });
    };

    handlePageChange = (page, pageSize) => {
        this.setState(state => {
            return {
                dataForm: Object.assign(state.dataForm, {page, pageSize})
            };
        },()=>{
			this.handleGetList()
		});
    };

	handleShowSizeChange = (page, pageSize) => {
		this.setState(state => {
            return {
                dataForm: Object.assign(state.dataForm, {page, pageSize})
            };
        },()=>{
			this.handleGetList()
		});
	}

    render() {
        const {
            form: { getFieldDecorator, getFieldsError },
        } = this.props;
        const {
            data,
            total,
			loading,
            dataForm: { pageSize, page },
        } = this.state;
        return (
            <>
                <BasePanel>
                    <Form layout="inline" onSubmit={this.handleSubmit} autoComplete="off">
                        <Form.Item>
                            {getFieldDecorator('key')(
                                <Input allowClear placeholder="用户名/用户操作" />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={hasErrors(getFieldsError())}
                            >
                                查 询
                            </Button>
                        </Form.Item>
                    </Form>
                </BasePanel>
                <BaseTable
					loading={loading}
                    dataSource={data}
                    rowKey="id"
                    pagination={false}
					extraHeight={52}
                >
                    <Column title="ID" width="100px" dataIndex="id" key="id" />
                    <Column
                        title="用户名"
                        align="center"
                        width="120px"
                        dataIndex="username"
                        key="username"
                    />
                    <Column
                        title="用户操作"
                        align="center"
                        width="160px"
                        dataIndex="operation"
                        key="operation"
                    />
                    <Column
                        title="请求方法"
                        align="center"
                        ellipsis={true}
                        dataIndex="method"
                        key="method"
                        render={(text, record) => {
							const content = (
								<div style={{maxWidth: '250px',wordWrap:'break-word'}}>
									{ text }
								</div>
							)
							return (
								<span>
									<Popover placement="topLeft" content={content} title="">
										{ text }
									</Popover>
								</span>
							)
                        }}
                    />
                    <Column
                        title="请求参数"
                        align="center"
                        ellipsis={true}
                        dataIndex="params"
                        key="params"
                        render={(text, record) => {
							const content = (
								<div style={{maxWidth: '250px',wordWrap:'break-word'}}>
									{ text }
								</div>
							)
                            return (
                                <span>
                                    <Popover placement="topLeft" content={content} title="">
                                        {text}
                                    </Popover>
                                </span>
                            );
                        }}
                    />
                    <Column
                        title="执行时长(毫秒)"
                        width="130px"
                        align="center"
                        dataIndex="time"
                        key="time"
                    />
                    <Column title="IP地址" width="160px" align="center" dataIndex="ip" key="ip" />
                    <Column
                        title="创建时间"
                        width="220px"
                        align="center"
                        ellipsis={true}
                        dataIndex="createDate"
                        key="createDate"
                    />
                </BaseTable>
                <BasePagination
                    total={total}
                    current={page}
                    pageSize={pageSize}
                    onChange={this.handlePageChange}
					onShowSizeChange={this.handleShowSizeChange}
                ></BasePagination>
            </>
        );
    }
}
const LogWrapper = Form.create()(Log);
export default LogWrapper;
