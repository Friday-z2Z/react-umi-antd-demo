/**
 * title: 匝道排队
 * 
 */

import React from 'react';
import { BasePanel, BaseTable, BasePagination } from '@/components';
import { Form, Button, Table, Select, DatePicker, Tag } from 'antd';
import ViewModal from './viewModal';
import * as API_RAMP_QUEUE from '@/services/data-center/ramp-queue';
import * as API_COMMON from '@/services';
import moment from 'moment';
import { downloadExcelFile } from '@/utils/tool'

const { Column } = Table;

class RampQueue extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            total: 0,
            dataForm: {
                page: 1,
                pageSize: 10,
                timeValue: [moment().startOf('day'), moment().endOf('day')]
            },
            loading: false,
            exportLoading: false,
            modalForm: {},
            visible: false,
            options: {
                cityOptions: [],
                roadOptions: [],
                stationOptions: [],
                queueOptions: []
            }
        };
    }

    componentDidMount() {
        this.getSelectOption()
        this.handleGetList();
    }

    getSelectOption = async() => {
        const { data: city = [] } = await API_COMMON.getCity()
        const { data: road = [] } = await API_COMMON.getRoad()
        const { data: station = [] } = await API_COMMON.getStation({})
        const { data: queue = [] } = await API_COMMON.getQueue()
        this.setState({
            options: {
                cityOptions: city,
                roadOptions: road,
                stationOptions: station,
                queueOptions: queue
            }
        })
    }

    handleGetList = (values = {}) => {
        this.setState({
            loading: true,
        });
        const { timeValue = [], ...rest } = { ...this.state.dataForm, ...values }
        const startTime = timeValue[0] ? timeValue[0].format('YYYY-MM-DD HH:mm:ss') : null
        const endTime = timeValue[1] ? timeValue[1].format('YYYY-MM-DD HH:mm:ss') : null
        const params = {
            ...rest,
            startTime,
            endTime,
        }
        this.setState({
            dataForm: {
                ...this.state.dataForm,
                timeValue,
                ...rest,
            }
        })
        API_RAMP_QUEUE.getList(params).then(res => {
            this.setState({
                data: res.data.list || [],
                total: res.data.totalCount || 0,
                loading: false,
            });
        });
    };

    handleExport = async() => {
        const { timeValue = [], ...rest } = { ...this.state.dataForm }
        const startTime = timeValue[0] ? timeValue[0].format('YYYY-MM-DD HH:mm:ss') : null
        const endTime = timeValue[1] ? timeValue[1].format('YYYY-MM-DD HH:mm:ss') : null
        const params = {
            ...rest,
            startTime,
            endTime,
        }
        this.setState({
            exportLoading: true
        })
        const res = await API_RAMP_QUEUE.queueExport(params)
        this.setState({
            exportLoading: false
        })
        downloadExcelFile(res.data, decodeURIComponent(res.headers['content-disposition'].split('=')[1]))
    }

    beforeOpen = async(record = {}) => {
        this.setState({
            modalForm: { ...record },
            visible: true,
        }, () => {
            this.viewModal.getDetail()
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

    handleCancel = () => {
        this.setState({ visible: false });
    };

    render() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        const {
            data,
            visible,
            total,
            loading,
            exportLoading,
            dataForm,
            modalForm,
            dataForm: { pageSize, page },
            options:{ cityOptions, roadOptions, stationOptions, queueOptions }
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
                            {getFieldDecorator('level')(
                                <Select style={{ width: 160 }} allowClear placeholder="请选择排队等级">
                                    {
                                        queueOptions.map(item => {
                                            return <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                                        })
                                    }
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('timeValue', {
                                initialValue: dataForm.timeValue
                            })(
                                <DatePicker.RangePicker
                                    showTime 
                                    format="YYYY-MM-DD HH:mm:ss"
                                    ranges={{
                                        '今天': [moment().startOf('day'), moment().endOf('day')],
                                        '最近一周': [moment().add(-1,'w'), moment()],
                                        '最近一个月': [moment().add(-1,'M'), moment()],
                                        '最近三个月': [moment().add(-1,'Q'), moment()],
                                    }}
                                />
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                查 询
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
                    rowKey="eventId"
                    pagination={false}
                    extraHeight={52}
                >
                    <Column
                        title="收费站"
                        align="center"
                        dataIndex="tollName"
                        key="tollName"
						ellipsis={true}
                    />
                    <Column
                        title="路段"
                        align="center"
                        dataIndex="roadName"
                        key="roadName"
						ellipsis={true}
                    />
                    <Column
                        title="所属地市"
                        align="center"
                        dataIndex="cityName"
                        key="cityName"
                        ellipsis={true}
                    />
                    <Column
                        title="匝道"
                        align="center"
                        dataIndex="rampName"
                        key="rampName"
                        ellipsis={true}
                    />
                    <Column
                        title="车道"
                        align="center"
                        dataIndex="laneName"
                        key="laneName"
                        ellipsis={true}
                    />
                    <Column
                        title="最高排队等级"
                        align="center"
                        dataIndex="highestLevelName"
                        key="highestLevelName"
                        width="120px"
                        render={(text, record) => (
                            <Tag color={text === '拥堵预警'?'#d89d0d':text==='严重拥堵'?'#ff4d4f':text==='一般拥堵'?'#f50':'#87d068'}>{text}</Tag>
                        )}
                    />
                    <Column
                        title="开始时间"
                        align="center"
                        dataIndex="startTime"
                        key="startTime"
                        ellipsis={true}
                    />
                    <Column
                        title="结束时间"
                        align="center"
                        dataIndex="endTime"
                        key="endTime"
                        ellipsis={true}
                    />
                    <Column
                        title="原因分析"
                        align="center"
                        dataIndex="reason"
                        key="reason"
                        ellipsis={true}
                    />
                    <Column
                        title="持续时长"
                        align="center"
                        dataIndex="duration"
                        key="duration"
                        ellipsis={true}
                    />
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
                <ViewModal 
					maskClosable={false}
                    visible={visible}
                    onCancel={this.handleCancel}
					onRef={node => (this.viewModal = node)}
                    dataForm={modalForm}
				></ViewModal>
            </>
        )
    }
}

const RampQueueWrapper = Form.create()(RampQueue);
export default RampQueueWrapper