/**
 * title: 点位管理
 * 
 */

import React from 'react';
import { Form, Button, Table, Select, Icon, Tag } from 'antd';
import { BasePanel, BaseTable, BasePagination, Copy } from '@/components';
import ViewModal from './viewModal'
import * as API_POINT_MANAGE from '@/services/news/point-manage';
import * as API_COMMON from '@/services';
import { downloadExcelFile } from '@/utils/tool'

const { Column } = Table;

class PointManage extends React.Component {
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
                stationOptions: [],
                sceneOptions: []
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
            { title: '点位名称', dataIndex: 'cameraName', key: 'cameraName', ellipsis: true, align: 'center' },
            { title: '场景', dataIndex: 'sceneName', key: 'sceneName', ellipsis: true, align: 'center' },
            { title: '点位IP', dataIndex: 'cameraIp', key: 'cameraIp', ellipsis: true, align: 'center' },
            { title: 'RTSP', dataIndex: 'rtsp', key: 'rtsp', width: 80, align: 'center', 
                render: text => {
                    return (
                        <Copy text={text}>
                            <Icon type="copy" theme="twoTone" style={{cursor: 'pointer'}} />
                        </Copy>
                    )
                } 
            },
            { title: '厂家', dataIndex: 'manufactor', key: 'manufactor', ellipsis: true, align: 'center' },
            { title: '取流状态', dataIndex: 'zlmStatus', key: 'zlmStatus', width: 120, align: 'center',
                render: text => (
                    <Tag color={text === 0 ? '#87d068': '#ff4d4f'}>{text === 0 ? '成功':'失败'}</Tag>
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
        const { data: scene = [] } = await API_COMMON.getScene({})
        this.setState({
            options: {
                cityOptions: city,
                roadOptions: road,
                stationOptions: station,
                sceneOptions: scene
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
        API_POINT_MANAGE.getList(params).then(res => {
            this.setState({
                data: res.data.list || [],
                total: res.data.totalCount || 0,
                loading: false,
            });
        });
    };

    handleExport = async() => {
        const params = {
            ...this.state.dataForm
        }
        this.setState({ exportLoading: true })
        const res = await API_POINT_MANAGE.cameraExport(params)
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

    handleCancel = () => {
        this.setState({ transVisible: false });
    };

    handleOk = (keys) => {
        this.setState({ transVisible: false, targetColumnsKeys: keys });
    }

    beforeOpen = async(record = {}) => {
        const { tollId, cameraIp } = record
        const { data } = await API_COMMON.getFlvUrl({ tollId, cameraIp })
        this.setState({
            viewForm:{ ...record, flvUrl: data.replace(/http/,'ws') },
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
            options:{ cityOptions, roadOptions, stationOptions, sceneOptions },
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
                                    实时视频
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
                    visible={viewVisible}
                    onCancel={() => this.setState({viewVisible: false})}
                    data={viewForm}
                />
            </>
        )
    }
}

const PointManageWrapper = Form.create()(PointManage);
export default PointManageWrapper