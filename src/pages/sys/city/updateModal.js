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
                title={dataForm.cityId ? '修改' : '新增'}
                destroyOnClose
            >
				<Form {...formItemLayout} autoComplete="off">
					<Form.Item label='地市编号'>
						{getFieldDecorator('cityCode', {
							initialValue: dataForm.cityCode,
							rules: [
								{
									required: true,
									message: '请填写地市编号',
								},
								{
									min: 6,
									max: 10,
									message: '地市编号长度必须在6-10之间'
								}
							],
						})(<Input allowClear placeholder="请填写地市编号" />)}
					</Form.Item>
					<Form.Item label='地市名称'>
						{getFieldDecorator('cityName', {
							initialValue: dataForm.cityName,
							rules: [
								{
									required: true,
									message: '请填写地市名称',
								},
								{
									min: 3,
									max: 5,
									message: '地市名称长度必须在3-5之间'
								}
							],
						})(<Input allowClear placeholder="请填写地市名称" />)}
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