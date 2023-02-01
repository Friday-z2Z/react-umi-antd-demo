/**
 * title: 信息记录
 * 
 */

import React from 'react';
import { BasePanel, BaseTable, BasePagination } from '@/components';
import { Form, Button, Table, Select, DatePicker } from 'antd';
import * as API_INFO_RECORDS from '@/services/news/info-records';
import * as API_COMMON from '@/services';
import moment from 'moment';
import { downloadExcelFile } from '@/utils/tool'

const { Column } = Table;

class InfoRecords extends React.Component {
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
            options: {
                cityOptions: [],
                roadOptions: [],
                stationOptions: [],
                eventOptions: []
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
        const { data: event = [] } = await API_COMMON.getEvent({})
        this.setState({
            options: {
                cityOptions: city,
                roadOptions: road,
                stationOptions: station,
                eventOptions: event
            }
        })
    }

    handleGetList = (values = {}) => {
        this.setState({
            loading: true,
        });
        const { timeValue: _timeValue = [], ...restProps } = values
        const formParams = Object.keys(values).length > 0 ? { timeValue: _timeValue, dataform: restProps } : {}

        const { timeValue = [], dataform, ...rest } = { ...this.state.dataForm, ...formParams }
        const reportingTime = timeValue[0] ? timeValue[0].format('YYYY-MM-DD HH:mm:ss') : null
        const recoveryTime = timeValue[1] ? timeValue[1].format('YYYY-MM-DD HH:mm:ss') : null
        const params = {
            ...rest,
            dataform: {
                reportingTime,
                recoveryTime,
            }
        }
        this.setState({
            dataForm: {
                ...this.state.dataForm,
                ...params,
                timeValue
            }
        })
        API_INFO_RECORDS.getList(params).then(res => {
            this.setState({
                data: res.page.list || [],
                total: res.page.totalCount || 0,
                loading: false,
            });
        });
    };

    handleExport = async() => {
        const { timeValue = [], dataform, ...rest } = this.state.dataForm
        const reportingTime = timeValue[0] ? timeValue[0].format('YYYY-MM-DD HH:mm:ss') : null
        const recoveryTime = timeValue[1] ? timeValue[1].format('YYYY-MM-DD HH:mm:ss') : null
        const params = {
            ...rest,
            dataform: {
                reportingTime,
                recoveryTime,
            }
        }
        this.setState({
            exportLoading: true
        })
        const res = await API_INFO_RECORDS.eventExport(params)
        this.setState({
            exportLoading: false
        })
        downloadExcelFile(res.data, decodeURIComponent(res.headers['content-disposition'].split('=')[1]))
    }

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

    render() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        const {
            data,
            total,
            loading,
            exportLoading,
            dataForm,
            dataForm: { pageSize, page },
            options:{ cityOptions, roadOptions, stationOptions, eventOptions }
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
                            {getFieldDecorator('eventCode')(
                                <Select style={{ width: 160 }} allowClear placeholder="请选择事件类型">
                                    {
                                        eventOptions.map(item => {
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
                    rowKey={record => record.tollId + Math.random()}
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
                        title="事件类型"
                        align="center"
                        dataIndex="eventName"
                        key="eventName"
                        ellipsis={true}
                    />
                    <Column
                        title="备注"
                        align="center"
                        dataIndex="remark"
                        key="remark"
                        ellipsis={true}
                    />
                    <Column
                        title="上报时间"
                        align="center"
                        dataIndex="reportingTime"
                        key="reportingTime"
                        ellipsis={true}
                    />
                    <Column
                        title="恢复时间"
                        align="center"
                        dataIndex="recoveryTime"
                        key="recoveryTime"
                        ellipsis={true}
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
        )
    }
}

const InfoRecordsWrapper = Form.create()(InfoRecords);
export default InfoRecordsWrapper
