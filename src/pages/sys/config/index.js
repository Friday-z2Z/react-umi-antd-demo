/**
 * title: 参数管理
 */

import React from 'react';
import { BasePanel, BaseTable, BasePagination } from '@/components';
import { Modal, Form, Input, Button, Table, Divider, Popover, message } from 'antd';
import * as API_CONFIG from '@/services/sys/config';
import UpdateModal from './updateModal'
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
			loading:false,
			modalForm:{},
			visible: false,
			selectedRows:[]
        };
    }

	componentDidMount() {
        this.handleGetList();
    }

	handleGetList = (values = {}) => {
		this.setState({
			loading: true
		})
        const params = {
            ...this.state.dataForm, ...values
        }
        API_CONFIG.getList(params).then(res => {
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

	beforeOpen = (record={}) => {
        this.setState({
            modalForm: { ...record },
			visible: true
        })
    };

	handleDel = (rows) => {
		const that = this
		const idList = rows.map(item=>item.id)
		confirm({
			title: `确定对【id=${idList.join(',')}】进行【删除】操作吗？`,
            centered: true,
			onOk(){
				API_CONFIG.del({idList}).then(()=>{
					message.success('删除成功')
					that.handleGetList()
				})
			}
		})
	}

	handleOk = async() => {
        const values = await this.updateModal.handleSubmit();
		API_CONFIG.update(values).then(res=>{
			message.success(`${values.id?'修改':'新增'}成功`)
			this.handleCancel()
			this.handleGetList()
		})
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

	render() {
		const rowSelection = {
			onChange: (selectedRowKeys, selectedRows) => {
				this.setState({
					selectedRows
				})
			}
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
                            {getFieldDecorator('paramKey')(
                                <Input allowClear placeholder="参数名" />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit">
                                查 询
                            </Button>
                        </Form.Item>
						<Form.Item>
                            <Button type="primary" onClick={()=>this.beforeOpen()}>
                                新 增
                            </Button>
                        </Form.Item>
						<Form.Item>
                            <Button type="danger" disabled={selectedRows.length<=0} onClick={()=>this.handleDel(selectedRows)}>
                                批量删除
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
					rowSelection={rowSelection}
                >
					<Column title="ID" width="100px" dataIndex="id" key="id" />
                    <Column
                        title="参数名"
                        align="center"
                        dataIndex="paramKey"
                        key="paramKey"
						ellipsis={true}
                    />
					<Column
                        title="参数值"
                        align="center"
                        dataIndex="paramValue"
                        key="paramValue"
						ellipsis={true}
						render={(text, record) => {
							const content = (
								<div style={{maxWidth: '500px',wordWrap:'break-word'}}>
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
                        title="备注"
                        align="center"
                        dataIndex="remark"
                        key="remark"
						ellipsis={true}
                    />
					<Column
                        title="操作"
                        align="center"
                        key="action"
                        width="150px"
                        render={(text, record) => (
                            <span>
                                <Button type="link" onClick={(e)=>this.beforeOpen(record, e)}>修改</Button>
                                <Divider type="vertical" />
                                <Button type="link" style={{color: '#ff4d4f'}} onClick={(e)=>this.handleDel([record], e)}>删除</Button>
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
const ConfigWrapper = Form.create()(Config);
export default ConfigWrapper;