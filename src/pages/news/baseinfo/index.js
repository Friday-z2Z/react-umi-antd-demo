/**
 * title: 基础信息
 * 
 */

import React from 'react';
import { Form, Button, Table, Select } from 'antd';
import { BasePanel, BaseTable, BasePagination } from '@/components';
import TransModal from './transModal'
import ViewModal from './viewModal'
import * as API_BASE_INFO from '@/services/news/baseinfo';
import * as API_COMMON from '@/services';
import { downloadExcelFile } from '@/utils/tool'

const { Column } = Table;

class BaseInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            total: 0,
            dataForm: {
                page: 1,
                pageSize: 10,
            },
            loading: false,
            exportLoading: false,
            options: {
                cityOptions: [],
                roadOptions: [],
                stationOptions: []
            },
            transVisible: false,
            viewVisible: false,
            viewForm: {},
            targetColumnsKeys: props.columns.map(item => item.key)
        };
    }

    static defaultProps = {
        columns: [
            { title: '收费站', dataIndex: 'tollName', key: 'tollName', width: 180, align: 'center', disabled: true },
            { title: '路段', dataIndex: 'roadName', key: 'roadName', width: 160, align: 'center', disabled: true },
            { title: '所属地市', dataIndex: 'cityName', key: 'cityName', width: 120, align: 'center', disabled: true },
            { title: '收费站人员', dataIndex: 'collectorNum', key: 'collectorNum', width: 120, align: 'center' },
            { title: '入口匝道数(个)', dataIndex: 'rampInNum', key: 'rampInNum', width: 160, align: 'center' },
            { title: '出口匝道数(个)', dataIndex: 'rampOutNum', key: 'rampOutNum', width: 160, align: 'center' },
            { title: '入口收费车道(个)', dataIndex: 'laneInNum', key: 'laneInNum', width: 160, align: 'center' },
            { title: '出口收费车道(个)', dataIndex: 'laneOutNum', key: 'laneOutNum', width: 160, align: 'center' },
            { title: '经度', dataIndex: 'longitude', key: 'longitude', width: 180, align: 'center' },
            { title: '纬度', dataIndex: 'latitude', key: 'latitude', width: 160, align: 'center' },
            { title: '站点负责人', dataIndex: 'leader', key: 'leader', width: 160, align: 'center' },
            { title: '负责人电话', dataIndex: 'phone', key: 'phone', width: 160, align: 'center' },
            { title: '点位个数', dataIndex: 'cameraNum', key: 'cameraNum', width: 120, align: 'center' },
        ]
    }

    componentDidMount() {
        this.getSelectOption()
        this.handleGetList();
    }

    getSelectOption = async() => {
        const { data: city = [] } = await API_COMMON.getCity()
        const { data: road = [] } = await API_COMMON.getRoad()
        const { data: station = [] } = await API_COMMON.getStation({})
        this.setState({
            options: {
                cityOptions: city,
                roadOptions: road,
                stationOptions: station
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
            loading: true,
        });
        const formParams = Object.keys(values).length > 0 ? { dataform: values } : {}
        const params = { ...this.state.dataForm, ...formParams }
        this.setState({
            dataForm: {
                ...this.state.dataForm,
                ...params
            }
        })
        API_BASE_INFO.getList(params).then(res => {
            this.setState({
                data: res.data.list || [],
                total: res.data.totalCount || 0,
                loading: false,
            });
        });
    };

    handleExport = async() => {
        const columns = this.filterColumns()
        const params = {
            ...this.state.dataForm,
            columnName: columns.map(item => item.title),
            columnNameCode: columns.map(item => item.key)
        }
        this.setState({ exportLoading: true })
        const res = await API_BASE_INFO.customizeExport(params)
        this.setState({ exportLoading: false })
        downloadExcelFile(res.data, decodeURIComponent(res.headers['content-disposition'].split('=')[1]))
    }

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

    filterColumns = () => {
        return this.props.columns.filter(item => this.state.targetColumnsKeys.includes(item.key))
    }

    handleCancel = () => {
        this.setState({ transVisible: false });
    };

    handleOk = (keys) => {
        this.setState({ transVisible: false, targetColumnsKeys: keys });
    }

    beforeOpen = async(record = {}) => {
        const { data = {} } = await API_BASE_INFO.getDetail(record.tollId)
        this.setState({
            viewForm: data,
            viewVisible: true
        })
    };

    render() {
        const {
            form: { getFieldDecorator },
            columns
        } = this.props;
        const {
            data,
            total,
            loading,
            exportLoading,
            dataForm: { pageSize, page },
            options:{ cityOptions, roadOptions, stationOptions },
            transVisible,
            viewVisible,
            viewForm
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
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('roadId')(
                                <Select style={{ width: 160 }} allowClear placeholder="请选择路段">
                                    {
                                        roadOptions.map(item => {
                                            return <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                                        })
                                    }
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('tollId')(
                                <Select style={{ width: 160 }} allowClear placeholder="请选择收费站">
                                    {
                                        stationOptions.map(item => {
                                            return <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                                        })
                                    }
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                查 询
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={() => this.setState({transVisible: true})}>
                                自定义表头
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" disabled={data.length <= 0} onClick={this.handleExport} loading={exportLoading}>
                                导 出
                            </Button>
                        </Form.Item>
                    </Form>
                </BasePanel>
                <BaseTable
                    loading={loading}
                    dataSource={data}
                    rowKey={record => record.tollId + Math.random()}
                    pagination={false}
                    extraHeight={52}
                    scroll={{ x: 1200 }}
                >
                    {
                        this.filterColumns().map(props => {
                            return <Column {...props} key={props.key} />
                        })
                    }
                    <Column
                        title="操作"
                        align="center"
                        key="action"
                        width="80px"
                        render={(text, record) => (
                            <span>
                                <Button type="link" onClick={e => this.beforeOpen(record, e)}>
                                    查看
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
                <TransModal
                    visible={transVisible}
                    dataSource={columns}
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                />
                <ViewModal 
                    visible={viewVisible}
                    onCancel={() => this.setState({viewVisible: false})}
                    data={viewForm}
                />
            </>
        )
    }
}

const BaseInfoWrapper = Form.create()(BaseInfo);
export default BaseInfoWrapper