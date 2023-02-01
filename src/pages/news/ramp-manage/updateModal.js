import React from 'react';
import { Form, message, InputNumber } from 'antd';
import { BaseModal, BaseTable } from '@/components';
import './index.less'

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
    state = {
        editing: false,
    };

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };

    save = e => {
        const { record, handleSave, precision } = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            this.toggleEdit();
            let newValues = {}
            Object.keys(values).forEach(item => newValues[item] = precision ? Number(values[item]).toFixed(precision) : values[item])
            handleSave({ ...record, ...newValues });
        });
    };

    renderCell = form => {
        this.form = form;
        const { children, dataIndex, record, min, max, precision, step, formatter } = this.props;
        const { editing } = this.state;
        return editing ? (
            <Form.Item style={{ margin: 0 }}>
                {form.getFieldDecorator(dataIndex, {
                    initialValue: record[dataIndex]
                })(
                    <InputNumber
                        style={{width: '100%'}}
                        ref={node => (this.input = node)}
                        onPressEnter={this.save}
                        onBlur={this.save}
                        min={min}
                        max={max}
                        precision={precision}
                        step={step}
                        formatter={formatter}
                    />,
                )}
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                onClick={this.toggleEdit}
            >
                <div className='editable-cell-value'>
                    {children}
                </div>
            </div>
        );
    };

    render() {
        const {
            editable,
            dataIndex,
            title,
            record,
            handleSave,
            handleSubmit,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {
                    editable ? 
                        (
                            (dataIndex === 'queueMinLength' && record.level > 0) ? 
                            children : 
                            <Form>
                                <EditableContext.Consumer>
                                    {this.renderCell}
                                </EditableContext.Consumer>
                            </Form>
                        ) : 
                    children
                }
            </td>
        );
    }
}

class UpdateModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
        };
        this.columns = [
            {
                title: '排队状态',
                key: 'levelName',
                dataIndex: 'levelName',
                align: 'center',
                width: 120
            },
            {
                title: '最短排队长度(m)',
                key: 'queueMinLength',
                dataIndex: 'queueMinLength',
                editable: true,
                align: 'center'
            },
            {
                title: '最长排队长度(m)',
                key: 'queueMaxLength',
                dataIndex: 'queueMaxLength',
                editable: true,
                align: 'center',
                required: true,
            },
            {
                title: '平均车速低于(km/h)',
                key: 'aveSpeed',
                dataIndex: 'aveSpeed',
                editable: true,
                align: 'center',
                required: true,
                width: 160,
                step: 10,
                precision: 2,
                formatter: value => Number(value).toFixed(2)
            },
            {
                title: '预计通行时长(分钟)',
                key: 'driveTime',
                dataIndex: 'driveTime',
                editable: true,
                align: 'center',
                required: true,
                width: 160,
            },
            {
                title: '命中比率',
                key: 'hitRatio',
                dataIndex: 'hitRatio',
                editable: true,
                align: 'center',
                required: true,
                precision: 2,
                formatter: value => Number(value).toFixed(2),
                min: 0,
                max: 100
            },
            {
                title: '采样时长',
                key: 'hitTime',
                dataIndex: 'hitTime',
                editable: true,
                align: 'center',
                required: true,
            },
        ];
    }

    componentDidMount() {
        this.props.onRef && this.props.onRef(this);
    }

    setData = (data = []) => {
        this.setState({
            dataSource: data,
        });
    };

    handleSave = row => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => row.level === item.level);
        const item = newData[index];
        if (index < newData.length - 1) {
            newData.splice(index, 2, {
                ...item,
                ...row,
            },{
                ...newData[index+1],
                queueMinLength: row.queueMaxLength
            });
        } else {
            newData.splice(index, 1, {
                ...item,
                ...row,
            });
        }
        this.setState({ dataSource: newData });
    };

    renderColumns = () => {
        return this.columns.map((col, index) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    ...col,
                    handleSave: this.handleSave
                })
            };
        });
    };

    onOk = () => {
        const { dataSource } = this.state;
        let dataIndex = ''
        const validateKey = this.columns.filter(item => item.required).map(item => item.dataIndex)
        const res = dataSource.some(item => {
            const itemKeys = Object.keys(item)
            return itemKeys.some(col => {
                const _res = validateKey.includes(col) && !item[col]
                if (_res) {
                    dataIndex = this.columns.filter(item => item.dataIndex === col)[0].title
                }
                return _res
            })
        })
        if(res) {
            message.warning('请填写必填项' + dataIndex)
            return
        }
        this.props.onOk(this.state.dataSource)
    }

    render() {
        const { dataSource } = this.state;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        const {
            data: { tollName = '', sceneName = '', rampName = '' },
        } = this.props;
        const columns = this.renderColumns();

        return (
            <BaseModal
                {...this.props}
                width={1100}
                title={`检测配置(${tollName + '--' + sceneName + '--' + rampName})`}
                destroyOnClose
                onOk={this.onOk}
            >
                <BaseTable
                    rowKey="level"
                    rowClassName={() => 'ramp-manage-editable-row'}
                    tableLayout="fixed"
                    components={components}
                    scroll={{}}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    footer={() => <p style={{color: '#ff4d4f'}}>{columns.filter(item => item.required).map(item => item.title).join('、') + '为必须填写列'}</p>}
                />
            </BaseModal>
        );
    }
}

export default UpdateModal;
