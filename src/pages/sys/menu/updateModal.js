import React from 'react';
import classnames from 'classnames';
import { connect } from 'dva';
import isEqual from 'lodash/isEqual';
import { Form, Radio, Input, InputNumber, Popover, Tree, TreeSelect } from 'antd';
import { formItemLayout } from '@/config/formLayout.config';
import { svgIcons } from '@/config/svgIcon.config';
import { Icon, BaseModal } from '@/components';
import styles from './index.less';

const { TreeNode } = Tree;

class UpdateModalForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            treeData: [],
            selectedKeys: [],
            searchValue: '',
            expandedKeys: [],
            autoExpandParent: true
        };
    }

    static defaultProps = {
        radioTypes: ['目录', '菜单', '按钮'],
    };

    componentDidMount() {
        this.props.onRef && this.props.onRef(this);
    }

    componentDidUpdate(preProps) {
        const { dataForm, dataForm: { parentId = '' } } = this.props;
        if (!isEqual(dataForm, preProps.dataForm)) {
            this.setState({
                expandedKeys: [parentId.toString()]
            })
        }
    }

    handleSubmit = () => {
        return new Promise((resolve, reject)=>{
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    const { children, ...rest } = this.props.dataForm
                    resolve({ ...rest, ...values })
                }
            });
        })
    };

    setSelectNode = () => {
        this.setState({
            selectedKeys: [this.props.dataForm.parentId.toString()],
        });
        // 如果选择的row没有上一级名称字段  将选择树的一级目录名称赋值
        if(!this.props.dataForm.parentName){
            this.props.form.setFieldsValue({
                parentName: this.props.treeData[0].name
            })
        }
    };

    handleSelect = (selectedKeys, { node }) => {
        const { props } = node;
        this.props.form.setFieldsValue({
            parentName: props.name,
            parentId: props.parentId
        })
        this.setState({
            selectedKeys
        })
    };

    onSearchChange = e => {
        const { dataForm: { parentId = '' } } = this.props;
        const { value } = e.target
        const expandedKeys = this.props.flattenMenuData.map(item => {
            if (value && item.name.indexOf(value) > -1) {
                return item.parentId.toString()
            }
            return null
        }).filter((item, i, self) => item && self.indexOf(item) === i)
        
        this.setState({
            expandedKeys: expandedKeys.length > 0 ? expandedKeys : [parentId.toString()],
            searchValue: value,
            autoExpandParent: true
        })
    }

    onExpand = expandedKeys => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    renderTree = () => {
        const { autoExpandParent, expandedKeys, searchValue } = this.state
        // const { dataForm: { parentId = '' } } = this.props
        
        const loop = data => {
            return data.map(item => {
                const index = item.name.indexOf(searchValue);
                const beforeStr = item.name.substr(0, index);
                const afterStr = item.name.substr(index + searchValue.length);
                const title =
                    index > -1 ? (
                        <span>
                            { beforeStr }
                            <span style={{ color: '#f50', fontWeight: 'bold' }}>{ searchValue }</span>
                            { afterStr }
                        </span>
                    ) : (
                        <span>{item.name}</span>
                    );
                if (item.children && item.children.length) {
                    return (
                        <TreeNode key={item.menuId} title={title} {...item}>
                            { loop(item.children) }
                        </TreeNode>
                    );
                }
                return <TreeNode key={item.menuId} title={title} {...item} />;
            });
            
        }
        return (
            <>
                <Input.Search placeholder="可搜索菜单" onChange={this.onSearchChange}></Input.Search>
                <Tree
                    className={styles.selectTree}
                    autoExpandParent={autoExpandParent}
                    expandedKeys={expandedKeys}
                    selectedKeys={this.state.selectedKeys}
                    onSelect={this.handleSelect}
                    onExpand={this.onExpand}
                >
                    { loop(this.props.treeData) }
                </Tree>
            </>
        );
    };

    renderIconsPop = () => {
        const { getFieldValue } = this.props.form;
        const iconsPop = svgIcons.map((item, index) => {
            return (
                <Icon
                    className={classnames(styles.icon, [
                        getFieldValue('icon') === item ? styles.iconActive : '',
                    ])}
                    type={item}
                    key={item + '-' + index}
                    onClick={() => this.iconClick(item)}
                />
            );
        });

        return <div className={styles.operateModalIconPopover}>{iconsPop}</div>;
    };

    iconClick = type => {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            icon: type,
        });
    };

    render() {
        const {
            form: { getFieldDecorator, getFieldValue },
            radioTypes,
            dataForm,
        } = this.props;
        return (
            <BaseModal
                {...this.props}
                title={(dataForm.menuId ? '修改' : '新增') + radioTypes[getFieldValue('type')]}
                destroyOnClose
            >
                <Form {...formItemLayout} autoComplete="off">
                    {/* 设置不可见的字段方便setFieldsValue设值 setFieldsValue设值必须表单存在该字段 */}
                    <Form.Item label="parentId" style={{display:'none'}}>
                        {getFieldDecorator('parentId', {
                            initialValue: dataForm.parentId,
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="类型">
                        {getFieldDecorator('type', { initialValue: dataForm.type })(
                            <Radio.Group>
                                {radioTypes.map((item, index) => (
                                    <Radio key={index} value={index}>
                                        {item}
                                    </Radio>
                                ))}
                            </Radio.Group>,
                        )}
                    </Form.Item>
                    <Form.Item label={radioTypes[getFieldValue('type')] + '名称'}>
                        {getFieldDecorator('name', {
                            initialValue: dataForm.name,
                            rules: [
                                {
                                    required: true,
                                    message: '请填写菜单名称',
                                },
                            ],
                        })(<Input allowClear placeholder="请填写菜单名称" />)}
                    </Form.Item>
                    <Form.Item label="上级菜单">
                        <Popover placement="bottomLeft" content={this.renderTree()} trigger="click">
                            {getFieldDecorator('parentName', {
                                initialValue: dataForm.parentName,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择上级菜单',
                                    },
                                ],
                            })(<Input readOnly placeholder="请选择上级菜单" />)}
                        </Popover>
                    </Form.Item>
                    {/* 菜单包含的字段 */}
                    {getFieldValue('type') === 1 && (
                        <Form.Item label="菜单路由">
                            {getFieldDecorator('url', {
                                initialValue: dataForm.url,
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写菜单路由',
                                    },
                                ],
                            })(<Input allowClear placeholder="请填写菜单路由" />)}
                        </Form.Item>
                    )}
                    {/* 目录包含的字段 */}
                    {!!getFieldValue('type') && (
                        <Form.Item label="授权标识">
                            {getFieldDecorator('perms', {
                                initialValue: dataForm.perms,
                            })(<Input allowClear placeholder="多个用逗号分隔, 如: user:list,user:create" />)}
                        </Form.Item>
                    )}
                    {/* 按钮没有的字段 */}
                    {getFieldValue('type') !== 2 && (
                        <>
                            <Form.Item label="排序号">
                                {getFieldDecorator('orderNum', {
                                    initialValue: dataForm.orderNum,
                                })(
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        min={0}
                                        placeholder="请填写排序号"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item label="菜单图标">
                                <Popover
                                    placement="bottomLeft"
                                    content={this.renderIconsPop()}
                                    trigger="click"
                                >
                                    {getFieldDecorator('icon', {
                                        initialValue: dataForm.icon,
                                    })(<Input readOnly placeholder="请选择菜单图标" />)}
                                </Popover>
                            </Form.Item>
                        </>
                    )}
                </Form>
            </BaseModal>
        );
    }
}
const UpdateModal = Form.create()(UpdateModalForm);
export default connect(({ sysMenu }) => ({
    ...sysMenu,
}))(UpdateModal);
