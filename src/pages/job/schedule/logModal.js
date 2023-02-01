import React from 'react';
import { Modal, Form, Button, Table, Input, Tag } from 'antd';
import { BasePanel, BaseTable, BasePagination, BaseModal } from '@/components';
import * as API_SCHEDULE from '@/services/job/schedule';
const { Column } = Table;


class Log extends React.Component {
	constructor() {
        super();
        this.state = {
            data: [],
            total: 0,
            dataForm: {
                page: 1,
                pageSize: 10,
            }
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
        API_SCHEDULE.getLogList(params).then(res => {
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

	handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.handleGetList(values);
            }
        });
    };

	getErrorInfo = (logId) => {
		API_SCHEDULE.getErrorInfo(logId).then(res=>{
			const { log, log:{ error, ...rest } } = res
			const errorContent = Object.keys({...rest, error}).map((item, index)=> {
				return (
					<div key={'log' + index}>
						【{item}】{log[item]}
					</div>
				)
			})
			
			Modal.error({
				title: '失败信息',
				centered: true,
				content: errorContent,
			});
		})
	}

	render() {
		const {
            form: { getFieldDecorator },
        } = this.props;
		const { loading, data, total, dataForm:{ page, pageSize } } = this.state
		return (
			<BaseModal
                {...this.props}
                title='日志列表'
				width={1040}
                destroyOnClose
            >
				<div style={{height: '534px'}}>
					<BasePanel>
					<Form layout="inline" onSubmit={this.handleSubmit} autoComplete="off">
							<Form.Item>
								{getFieldDecorator('jobId')(
									<Input allowClear placeholder="任务ID" />,
								)}
							</Form.Item>
							<Form.Item>
								<Button type="primary" htmlType="submit">
									查 询
								</Button>
							</Form.Item>
						</Form>
					</BasePanel>
					<BaseTable
						loading={loading}
						dataSource={data}
						rowKey="logId"
						pagination={false}
						scroll={{ y: '400px' }}
					>
						<Column title="日志ID" width="100px" dataIndex="logId" key="logId" />
						<Column
							title="任务ID"
							align="center"
							dataIndex="jobId"
							key="jobId"
							width="100px"
						/>
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
							width="120px"
						/>
						<Column
							title="状态"
							align="center"
							dataIndex="status"
							key="status"
							width="120px"
							render={(text, { logId }) => (
								<span>
									<Tag color={text ? '#ff4d4f' : '#87d068'} style={{cursor: text ? 'pointer':'normal'}} onClick={text ? () => this.getErrorInfo(logId):null}>{ text ? '失败' : '成功' }</Tag>
								</span>
							)}
						/>
						<Column
							title="耗时(毫秒)"
							align="center"
							dataIndex="times"
							key="times"
							width="150px"
						/>
						<Column
							title="执行时间"
							align="center"
							dataIndex="createTime"
							key="createTime"
							width="200px"
						/>
					</BaseTable>
					<BasePagination
						total={total}
						current={page}
						pageSize={pageSize}
						onChange={this.handlePageChange}
						onShowSizeChange={this.handleShowSizeChange}
					></BasePagination>
				</div>
			</BaseModal>
		)
	}
}
const LogModal = Form.create()(Log);
export default LogModal;