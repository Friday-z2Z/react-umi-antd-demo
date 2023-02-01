/**
 * title: 收费站管理
 */

import React from 'react';
import { BasePanel, BaseTable, BasePagination } from '@/components';
import * as API_TOLL from '@/services/sys/toll';
import * as API_COMMON from '@/services';
import UpdateModal from './updateModal';
import ParamModal from './paramModal';
import { Form, message, Button, Table, Divider, Select } from 'antd';

const { Column } = Table;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Toll extends React.Component {

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
                cityOptions: [],
                roadOptions: []
            },
            paramVisible: false,
        };
    }

    componentDidMount() {
        this.getStationOption(); // 收费站下拉
        this.getCityRoad()
        this.handleGetList();
    }

    getStationOption = async() => {
        const { data = [] } = await API_COMMON.getStation({})
        this.setState({
            stationOptions: data
        })
    }

    getCityRoad = async() => {
        const { data: city = [] } = await API_COMMON.getCity()
        const { data: road = [] } = await API_COMMON.getRoad()
        this.setState({
            options: {
                cityOptions: city,
                roadOptions: road
            }
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
        this.getStationOption()
        const formParams = Object.keys(values).length > 0 ? { dataform: values } : {}
        const params = { ...this.state.dataForm, ...formParams }
        API_TOLL.getList(params).then(res => {
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
        values.id ? await API_TOLL.save(values) : await API_TOLL.update(values)
        message.success(`${values.id?'新增':'修改'}成功`)
        this.handleCancel();
        this.handleGetList();
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleParam = async(record) => {
        this.setState({
            paramVisible: true,
        }, () => {
            this.paramModal.getDetail(record.tollId)
        })
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
            stationOptions,
            visible,
            modalForm,
            options,
            paramVisible,
        } = this.state;
        return (
            <>
                <BasePanel>
                    <Form layout="inline" onSubmit={this.handleSubmit} autoComplete="off">
                        <Form.Item>
                            {getFieldDecorator('tollId')(
                                <Select style={{ width: 160 }} allowClear placeholder="请选择收费站">
                                    {
                                        stationOptions.map(item => {
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
                    rowKey="tollId"
                    pagination={false}
					extraHeight={52}
                >
                    <Column title="编号" align="center" dataIndex="tollId" key="tollId" />
                    <Column
                        title="名称"
                        align="center"
                        dataIndex="tollName"
                        key="tollName"
                    />
                    <Column
                        title="所属地市"
                        align="center"
                        dataIndex="cityName"
                        key="cityName"
                    />
                    <Column
                        title="所属路段中心"
                        align="center"
                        ellipsis={true}
                        dataIndex="roadName"
                        key="roadName"
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
                                <Button type="link" onClick={e => this.handleParam(record, e)}>
                                    对接参数
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
                    options={options}
				></UpdateModal>
                <ParamModal
                    maskClosable={false}
                    visible={paramVisible}
                    onCancel={() => this.setState({ paramVisible: false })}
					onRef={node => (this.paramModal = node)}
                ></ParamModal>
            </>
        );
    }
}
const TollWrapper = Form.create()(Toll);
export default TollWrapper;
