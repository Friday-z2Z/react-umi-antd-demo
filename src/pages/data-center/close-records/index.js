/**
 * title: 关闭记录
 * 
 */

import React from 'react';
import { BasePanel, BaseTable, BasePagination } from '@/components';
import { Form, Button, Table, Select, DatePicker, Tag } from 'antd';
import ViewModal from './viewModal';
import * as API_CLOSE_RECORDS from '@/services/data-center/close-records';
import * as API_COMMON from '@/services';
import moment from 'moment';
import { downloadExcelFile } from '@/utils/tool'

const { Column } = Table;

class CloseRecords extends React.Component {
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
                queueOptions: [],
                sceneOptions: [],
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
        const { data: scene = [] } = await API_COMMON.getScene({})
        const { data: event = [] } = await API_COMMON.getQueueEvent({})
        this.setState({
            options: {
                cityOptions: city,
                roadOptions: road,
                stationOptions: station,
                sceneOptions: scene,
                eventOptions: event
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
                ...rest
            }
        })
        API_CLOSE_RECORDS.getList(params).then(res => {
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
        const res = await API_CLOSE_RECORDS.eventExport(params)
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
            options:{ cityOptions, roadOptions, stationOptions, sceneOptions, eventOptions }
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
                            {getFieldDecorator('scene')(
                                <Select style={{ width: 160 }} allowClear placeholder="请选择场景">
                                    {
                                        sceneOptions.map(item => {
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
                    rowKey="id"
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
                        title="场景"
                        align="center"
                        dataIndex="sceneName"
                        key="sceneName"
                        ellipsis={true}
                    />
                    <Column
                        title="点位名称"
                        align="center"
                        dataIndex="cameraName"
                        key="cameraName"
                        ellipsis={true}
                    />
                    <Column
                        title="位置"
                        align="center"
                        dataIndex="laneName"
                        key="laneName"
                        ellipsis={true}
                    />
                    <Column
                        title="事件类型"
                        align="center"
                        dataIndex="eventCodeName"
                        key="eventCodeName"
                        width="120px"
                        render={(text, record) => (
                            <Tag color={record.eventCode === 'roadClose' ? '#ff4d4f' : '#87d068'}>{text}</Tag>
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
                        dataIndex="endTimeStr"
                        key="endTimeStr"
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

const CloseRecordsWrapper = Form.create()(CloseRecords);
export default CloseRecordsWrapper
