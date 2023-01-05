import React from 'react';
import { connect } from 'dva';
import { Form, Input, Tree } from 'antd';
import { BaseModal } from '@/components'
import { formItemLayout } from '@/config/formLayout.config';
import styles from './index.less'

class UpdateModalForm extends React.Component {
	constructor(props) {
		super()
		this.state = {}
	}

	componentDidMount() {
        this.props.onRef && this.props.onRef(this);
    }

	handleSubmit = () => {
        return new Promise((resolve, reject)=>{
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    const { children, ...rest } = this.props.dataForm
                    resolve({ ...rest, ...values, menuIdList: this.props.checkedKeys.concat([this.props.defaultId]) })
                }
            });
        })
    };

	onCheck = checkedKeys => {
		this.props.dispatch({
			type: 'role/setCheckedIds',
			payload: { checkedKeys }
		})
	};

	renderTree = () => {
		const { checkedKeys = [] } = this.props
        const loop = (data = []) => {
            return data.map(item => {
                if (item.children && item.children.length) {
                    return (
                        <Tree.TreeNode key={item.menuId} title={item.name} {...item}>
                            { loop(item.children) }
                        </Tree.TreeNode>
                    );
                }
                return <Tree.TreeNode key={item.menuId} title={item.name} {...item} />;
            });
            
        }
        return (
            <div className={styles.treeWrap}>
                <Tree
					checkable={true}
					defaultExpandAll={true}
					checkedKeys={checkedKeys}
					onCheck={this.onCheck}
				>
                    { loop(this.props.treeData) }
                </Tree>
            </div>
        );
    };

	render() {
		const {
            form: { getFieldDecorator },
            dataForm,
        } = this.props;
		return (
			<BaseModal
                {...this.props}
                title={dataForm.roleId ? '修改' : '新增'}
                destroyOnClose
            >
				<Form {...formItemLayout} autoComplete="off">
					<Form.Item label='角色名称'>
						{getFieldDecorator('roleName', {
							initialValue: dataForm.roleName,
							rules: [
								{
									required: true,
									message: '请填写角色名称',
								},
							],
						})(<Input allowClear placeholder="请填写角色名称" />)}
					</Form.Item>
					<Form.Item label='备注'>
						{getFieldDecorator('remark', {
							initialValue: dataForm.remark,
						})(<Input allowClear placeholder="请填写备注" />)}
					</Form.Item>
					<Form.Item label='授权'>
						<div className={styles.treeWrap}>
							{this.renderTree()}
						</div>
					</Form.Item>
				</Form>
			</BaseModal>
		)
	}
}
const UpdateModal = Form.create()(UpdateModalForm);
export default connect(({ role }) => ({
	...role
}))(UpdateModal)