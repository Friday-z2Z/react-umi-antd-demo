/**
 * title: 收费站状态统计
 * 
 */

import React from 'react';
import { Form, Button, Table, Select, DatePicker, Radio, Checkbox } from 'antd';
import { BasePanel, BaseTable, BasePagination, YearPicker } from '@/components';
import TransModal from './transModal'
import * as API_STATE_STAT from '@/services/data-center/state-stat';
import * as API_COMMON from '@/services';
import moment from 'moment';
import { downloadExcelFile } from '@/utils/tool'

const { Column } = Table;

class StateStat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            total: 0,
            dataForm: {
                page: 1,
                pageSize: 10,
                timeType: '1',
                merge: true,
                time: moment()
            },
            loading: false,
            exportLoading: false,
            options: {
                cityOptions: [],
                roadOptions: [],
                stationOptions: [],
                queueOptions: []
            },
            transVisible: false,
            targetColumnsKeys: props.columns.map(item => item.key)
        };
    }

    static defaultProps = {
        columns: [
            { title: '收费站', dataIndex: 'tollName', key: 'tollName', width: 180, align: 'center', disabled: true },
            { title: '方向', dataIndex: 'sceneName', key: 'sceneName', width: 120, align: 'center', disabled: true },
            { title: '路段', dataIndex: 'roadName', key: 'roadName', width: 160, align: 'center', disabled: true },
            { title: '所属地市', dataIndex: 'cityName', key: 'cityName', width: 120, align: 'center', disabled: true },
            { title: '车流量(辆)', dataIndex: 'trafficFlow', key: 'trafficFlow', width: 120, align: 'center' },
            { title: '拥堵次数(次)', dataIndex: 'jamNum', key: 'jamNum', width: 120, align: 'center' },
            { title: '拥堵总时长(分钟)', dataIndex: 'jamTotalDuration', key: 'jamTotalDuration', width: 160, align: 'center' },
            { title: '最长拥堵时长(分钟)', dataIndex: 'jamLongDuration', key: 'jamLongDuration', width: 160, align: 'center' },
            { title: '车道关闭(次)', dataIndex: 'laneClose', key: 'laneClose', width: 120, align: 'center' },
            { title: '车道关闭总时长(分钟)', dataIndex: 'laneTotalDuration', key: 'laneTotalDuration', width: 180, align: 'center' },
            { title: '倒灌导致拥堵', dataIndex: 'flowBackwardNum', key: 'flowBackwardNum', width: 160, align: 'center' },
            { title: '车道关闭导致拥堵', dataIndex: 'laneClosedNum', key: 'laneClosedNum', width: 160, align: 'center' },
            { title: '大量流量导致拥堵', dataIndex: 'heavyTrafficNum', key: 'heavyTrafficNum', width: 160, align: 'center' },
            { title: '时间纬度', dataIndex: 'recordDate', key: 'recordDate', width: 120, align: 'center' },
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
        const { data: queue = [] } = await API_COMMON.getQueue2()
        this.setState({
            options: {
                cityOptions: city,
                roadOptions: road,
                stationOptions: station,
                queueOptions: queue
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
        const { time, timeType, ...rest } = { ...this.state.dataForm, ...values }
        const params = {
            ...rest,
            timeType,
            time: time.format('YYYY-MM-DD HH:mm:ss')
        }
        this.setState({
            dataForm: {
                ...this.state.dataForm,
                ...params,
                time
            }
        })
        API_STATE_STAT.getList(params).then(res => {
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
            time: this.state.dataForm.time.format('YYYY-MM-DD HH:mm:ss'),
            columnName: columns.map(item => item.title),
            columnNameCode: columns.map(item => item.key)
        }
        this.setState({ exportLoading: true })
        const res = await API_STATE_STAT.stationExport(params)
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

    render() {
        const {
            form: { getFieldDecorator, getFieldValue, setFieldsValue },
            columns
        } = this.props;
        const {
            data,
            total,
            loading,
            exportLoading,
            dataForm,
            dataForm:{ merge },
            dataForm: { pageSize, page },
            options:{ cityOptions, roadOptions, stationOptions, queueOptions },
            transVisible,
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
                            {getFieldDecorator('jamTypes')(
                                <Select style={{ width: 200 }} mode="multiple" maxTagCount={1} allowClear placeholder="请选择拥堵类型">
                                    {
                                        queueOptions.map(item => {
                                            return <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                                        })
                                    }
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('timeType', {
                                initialValue: dataForm.timeType
                            })(
                                <Radio.Group buttonStyle="solid">
                                    <Radio.Button value="1">日</Radio.Button>
                                    <Radio.Button value="2">月</Radio.Button>
                                    <Radio.Button value="3">年</Radio.Button>
                                </Radio.Group>
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('time', {
                                initialValue: dataForm.time
                            })(
                                getFieldValue('timeType') === '1' ?
                                <DatePicker
                                    style={{width: 120, minWidth: 120}}
                                    allowClear={false}
                                /> : getFieldValue('timeType') === '2' ?
                                <DatePicker.MonthPicker
                                    style={{width: 120, minWidth: 120}} 
                                    allowClear={false}
                                /> :
                                <YearPicker
                                    style={{width: 120, minWidth: 120}}
                                    allowClear={false}
                                    onPanelChange={(v) => setFieldsValue({'time': v})}
                                />
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('merge', {
                                valuePropName: 'checked',
                                initialValue: dataForm.merge
                            })(
                                <Checkbox>合并出入口统计数据</Checkbox>
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
                            return (props.dataIndex === 'sceneName' && merge) ? null:  <Column {...props} key={props.key} />
                        })
                    }
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
            </>
        )
    }
}

const StateStatWrapper = Form.create()(StateStat);
export default StateStatWrapper