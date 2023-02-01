/**
 * title: 收费车道管理
 * 
 */

import React from 'react';
import { Form, Button, Table, Select } from 'antd';
import { BasePanel, BaseTable, BasePagination } from '@/components';
import * as API_TOLL_LANE_MANAGE from '@/services/news/toll-lane-manage';
import * as API_COMMON from '@/services';

const { Column } = Table;

class TollLaneManage extends React.Component {
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
                sceneOptions: [],
                stationOptions: []
            }
        };
    }

    static defaultProps = {
        columns: [
            { title: '收费站', dataIndex: 'tollName', key: 'tollName', ellipsis: true, align: 'center' },
            { title: '路段', dataIndex: 'roadName', key: 'roadName', ellipsis: true, align: 'center' },
            { title: '所属地市', dataIndex: 'cityName', key: 'cityName', ellipsis: true, align: 'center' },
            { title: '场景', dataIndex: 'sceneName', key: 'sceneName', ellipsis: true, align: 'center' },
            { title: '收费车道名称', dataIndex: 'tollLaneName', key: 'tollLaneName', ellipsis: true, align: 'center' },
        ]
    }

    componentDidMount() {
        this.getSelectOption()
        this.handleGetList();
    }

    getSelectOption = async() => {
        const { data: city = [] } = await API_COMMON.getCity()
        const { data: road = [] } = await API_COMMON.getRoad()
        const { data: scene = [] } = await API_COMMON.getScene()
        const { data: station = [] } = await API_COMMON.getStation({})
        this.setState({
            options: {
                cityOptions: city,
                roadOptions: road,
                sceneOptions: scene,
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
        API_TOLL_LANE_MANAGE.getList(params).then(res => {
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
                            {getFieldDecorator('scene')(
                                <Select style={{ width: 160 }} allowClear placeholder="请选择场景">
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
                    rowKey={record => record.tollId + Math.random()}
                    pagination={false}
                    extraHeight={52}
                >
                    {
                        columns.map(props => {
                            return <Column {...props} key={props.key} />
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
            </>
        )
    }
}

const TollLaneManageWrapper = Form.create()(TollLaneManage);
export default TollLaneManageWrapper