import React from 'react';
import { Form, Input } from 'antd';
import { BaseModal } from '@/components'
import { formItemLayout } from '@/config/formLayout.config';

class UpdateModalForm extends React.Component {

	componentDidMount() {
        this.props.onRef && this.props.onRef(this);
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
						
					</Form.Item>
				</Form>
			</BaseModal>
		)
	}
}
const UpdateModal = Form.create()(UpdateModalForm);
export default UpdateModal;