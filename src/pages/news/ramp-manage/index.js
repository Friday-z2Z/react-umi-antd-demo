/**
 * title: 匝道管理
 * 
 */

import React from 'react';
import { Form, Button, Table, Select, Tag, message } from 'antd';
import { BasePanel, BaseTable, BasePagination } from '@/components';
import UpdateModal from './updateModal'
import * as API_RAMP_MANAGE from '@/services/news/ramp-manage';
import * as API_COMMON from '@/services';

const { Column } = Table;

class RampManage extends React.Component {
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
            options: {
                cityOptions: [],
                roadOptions: [],
                stationOptions: []
            },
            viewVisible: false,
            viewForm: {},
        };
    }

    static defaultProps = {
        columns: [
            { title: '收费站', dataIndex: 'tollName', key: 'tollName', ellipsis: true, align: 'center' },
            { title: '路段', dataIndex: 'roadName', key: 'roadName', ellipsis: true, align: 'center' },
            { title: '所属地市', dataIndex: 'cityName', key: 'cityName', ellipsis: true, align: 'center' },
            { title: '匝道名称', dataIndex: 'rampName', key: 'rampName', ellipsis: true, align: 'center' },
            { title: '场景', dataIndex: 'sceneName', key: 'sceneName', ellipsis: true, align: 'center' },
            { title: '长度(米)', dataIndex: 'rampLength', key: 'rampLength', ellipsis: true, align: 'center' },
            { title: '匝道车道', dataIndex: 'rampVehicleLaneName', key: 'rampVehicleLaneName', ellipsis: true, align: 'center' },
            { title: '数据状态', dataIndex: 'rampDataStatus', key: 'rampDataStatus', width: 120, align: 'center',
                render: text => (
                    <Tag color={text === '数据正常上传' ? '#87d068': '#ff4d4f'}>{text}</Tag>
                )
            }
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
        API_RAMP_MANAGE.getList(params).then(res => {
            this.setState({
                data: res.data.list || [],
                total: res.data.totalCount || 0,
                loading: false,
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

    handleCancel = () => {
        this.setState({ viewVisible: false });
    };

    handleOk = async(data) => {
        this.setState({ viewVisible: false });
        const { code = '' } = await API_RAMP_MANAGE.queueconfigUpdate(data)
        if(code === 0) {
            message.success('修改成功')
        }
    }

    beforeOpen = async(record = {}) => {
        const { rampId } = record
        const { data } = await API_RAMP_MANAGE.queueconfigList(rampId)
        this.setState({
            viewForm:{ ...record, config: data },
            viewVisible: true
        })
        this.updateModal.setData(data)
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
            dataForm: { pageSize, page },
            options:{ cityOptions, roadOptions, stationOptions },
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
                    </Form>
                </BasePanel>
                <BaseTable
                    loading={loading}
                    dataSource={data}
                    rowKey={record => record.rampId + Math.random()}
                    pagination={false}
                    extraHeight={52}
                >
                    {
                        columns.map(props => {
                            return <Column {...props} key={props.key} />
                        })
                    }
                    <Column
                        title="操作"
                        align="center"
                        key="action"
                        width="100px"
                        render={(text, record) => (
                            <span>
                                <Button type="link" onClick={e => this.beforeOpen(record, e)}>
                                    设置配置
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
                    visible={viewVisible}
                    onCancel={() => this.setState({viewVisible: false})}
                    onOk={this.handleOk}
                    data={viewForm}
                    onRef={node => (this.updateModal = node)}
                />
            </>
        )
    }
}

const RampManageWrapper = Form.create()(RampManage);
export default RampManageWrapper