/**
 * title: 地市管理
 */

import React from 'react';
import { BasePanel, BaseTable, BasePagination } from '@/components';
import * as API_CITY from '@/services/sys/city';
import * as API_COMMON from '@/services';
import UpdateModal from './updateModal';
import { Form, message, Button, Table, Divider, Select, Modal } from 'antd';

const { Column } = Table;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class City extends React.Component {

    constructor() {
        super();
        this.state = {
            data: [],
            total: 0,
            stationOptions:[],
            dataForm: {
                page: 1,
                pageSize: 10,
            },
			loading:false,
            visible: false,
            modalForm: {},
            options: {
                cityOptions: []
            }
        };
    }

    componentDidMount() {
        this.getCityOption(); // 收费站下拉
        this.handleGetList();
    }

    getCityOption = async() => {
        const { data = [] } = await API_COMMON.getCity({})
        this.setState({
            options: { cityOptions: data }
        })
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
        this.getCityOption()
        const formParams = Object.keys(values).length > 0 ? { dataform: values } : {}
        const params = { ...this.state.dataForm, ...formParams }
        API_CITY.getList(params).then(res => {
            this.setState({
                data: res.data.list || [],
                total: res.data.totalCount || 0,
				loading: false,
                dataForm: {
                    ...this.state.dataForm,
                    ...params
                }
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

    beforeOpen = async(record = {id:1}) => {
        this.setState({
            modalForm: { ...record },
            visible: true,
        });
    };

    handleOk = async () => {
        const values = await this.updateModal.handleSubmit();
        values.id ? await API_CITY.save(values) : await API_CITY.update(values)
        message.success(`${values.id?'新增':'修改'}成功`)
        this.handleCancel();
        this.handleGetList();
    };

    handleDel = ({ tollNum, cityName, cityId }) => {
        const that = this
        Modal.confirm({
            title: `${Number(tollNum) > 0 ? '请先解除所有绑定收费站！' : '确定删除' + cityName + '吗？'}`,
            centered: true,
            onOk() {
                if (Number(tollNum) <= 0) {
                    API_CITY.del(cityId).then(() => {
                        message.success('删除成功')
                        that.handleGetList()
                    });
                }
            },
        });
    }

    handleCancel = () => {
        this.setState({ visible: false });
    };

    render() {
        const {
            form: { getFieldDecorator, getFieldsError },
        } = this.props;
        const {
            data,
            total,
			loading,
            dataForm: { pageSize, page },
            visible,
            modalForm,
            options: { cityOptions }
        } = this.state;
        return (
            <>
                <BasePanel>
                    <Form layout="inline" onSubmit={this.handleSubmit} autoComplete="off">
                        <Form.Item>
                            {getFieldDecorator('cityId')(
                                <Select style={{ width: 160 }} allowClear placeholder="请选择地市">
                                    {
                                        cityOptions.map(item => {
                                            return <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                                        })
                                    }
                                </Select>,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button
                                htmlType="submit"
                                disabled={hasErrors(getFieldsError())}
                            >
                                查 询
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={() => this.beforeOpen()}>
                                新 增
                            </Button>
                        </Form.Item>
                    </Form>
                </BasePanel>
                <BaseTable
					loading={loading}
                    dataSource={data}
                    rowKey={record => record.cityId + Math.random()}
                    pagination={false}
					extraHeight={52}
                >
                    <Column title="编号" align="center" dataIndex="cityCode" key="cityCode" ellipsis={true} />
                    <Column
                        title="名称"
                        align="center"
                        dataIndex="cityName"
                        key="cityName"
                        ellipsis={true}
                    />
                    <Column
                        title="负责人"
                        align="center"
                        dataIndex="leader"
                        key="leader"
                        ellipsis={true}
                    />
                    <Column
                        title="联系方式"
                        align="center"
                        ellipsis={true}
                        dataIndex="phone"
                        key="phone"
                    />
                    <Column
                        title="包含收费站"
                        align="center"
                        ellipsis={true}
                        dataIndex="tollNum"
                        key="tollNum"
                    />
                    <Column
                        title="操作"
                        align="center"
                        key="action"
                        width="160px"
                        render={(text, record) => (
                            <span>
                                <Button type="link" onClick={e => this.beforeOpen(record, e)}>
                                    修改
                                </Button>
                                <Divider type="vertical" />
                                <Button type="link" onClick={e => this.handleDel(record, e)}>
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
        );
    }
}
const CityWrapper = Form.create()(City);
export default CityWrapper;
