import React from 'react';
import { Form, Input } from 'antd';
import { BaseModal } from '@/components'
import { formItemLayout } from '@/config/formLayout.config';

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
                    resolve({ ...rest, ...values })
                }
            });
        })
    };

	render() {
		const {
            form: { getFieldDecorator },
            dataForm
        } = this.props;
		return (
			<BaseModal
                {...this.props}
                title={dataForm.roadId ? '修改' : '新增'}
                destroyOnClose
            >
				<Form {...formItemLayout} autoComplete="off">
					<Form.Item label='路段编号'>
						{getFieldDecorator('roadCode', {
							initialValue: dataForm.roadCode,
							rules: [
								{
									required: true,
									message: '请填写路段编号',
								}
							],
						})(<Input allowClear placeholder="请填写路段编号" />)}
					</Form.Item>
					<Form.Item label='路段名称'>
						{getFieldDecorator('roadName', {
							initialValue: dataForm.roadName,
							rules: [
								{
									required: true,
									message: '请填写路段名称',
								},
								{
									min: 2,
									max: 20,
									message: '路段名称长度必须在2-20之间'
								}
							],
						})(<Input allowClear placeholder="请填写路段名称" />)}
					</Form.Item>
					<Form.Item label='负责人'>
						{getFieldDecorator('leader', {
							initialValue: dataForm.leader,
						})(<Input allowClear placeholder="请填写负责人" />)}
					</Form.Item>
					<Form.Item label='联系方式'>
						{getFieldDecorator('phone', {
							initialValue: dataForm.phone,
						})(<Input allowClear placeholder="请填写联系方式" />)}
					</Form.Item>
				</Form>
			</BaseModal>
		)
	}
}
const UpdateModal = Form.create()(UpdateModalForm);
export default UpdateModal