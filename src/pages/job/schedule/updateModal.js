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
                title={dataForm.jobId ? '修改' : '新增'}
                destroyOnClose
            >
				<Form {...formItemLayout} autoComplete="off">
					<Form.Item label='bean名称'>
						{getFieldDecorator('beanName', {
							initialValue: dataForm.beanName,
							rules: [
								{
									required: true,
									message: '请填写bean名称',
								},
							],
						})(<Input allowClear placeholder="spring bean名称, 如: testTask" />)}
					</Form.Item>
					<Form.Item label='参数'>
						{getFieldDecorator('params', {
							initialValue: dataForm.params,
						})(<Input allowClear placeholder="请填写参数" />)}
					</Form.Item>
					<Form.Item label='cron表达式'>
						{getFieldDecorator('cronExpression', {
							initialValue: dataForm.cronExpression,
							rules: [
								{
									required: true,
									message: '请填写cron表达式',
								},
							],
						})(<Input allowClear placeholder="如: 0 0 12 * * ?" />)}
					</Form.Item>
					<Form.Item label='备注'>
						{getFieldDecorator('remark', {
							initialValue: dataForm.remark,
						})(<Input allowClear placeholder="请填写备注" />)}
					</Form.Item>
				</Form>
			</BaseModal>
		)
	}
}
const UpdateModal = Form.create()(UpdateModalForm);
export default UpdateModal;