import React from 'react';
import { Form, Input, Select } from 'antd';
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

	onCityChange = (value, option = {}) => {
		const { dataForm } = this.props
		dataForm.cityId = value
		dataForm.cityName = option?.props?.children
	}

	onRoadChange = (value, option = {}) => {
		const { dataForm } = this.props
		dataForm.roadId = value
		dataForm.roadName = option?.props?.children
	}

	render() {
		const {
            form: { getFieldDecorator },
            dataForm,
			options: { cityOptions, roadOptions }
        } = this.props;
		return (
			<BaseModal
                {...this.props}
                title={dataForm.tollId ? '修改' : '新增'}
                destroyOnClose
            >
				<Form {...formItemLayout} autoComplete="off">
					<Form.Item label='收费站编号'>
						{getFieldDecorator('tollId', {
							initialValue: dataForm.tollId,
							rules: [
								{
									required: true,
									message: '请填写收费站编号',
								},
								{
									min: 2,
									message: '收费站编号最小长度为2',
								},
								{
									max: 10,
									message: '收费站编号最大长度为10',
								},
							],
						})(<Input disabled={!!dataForm.tollId} allowClear placeholder="请填写收费站编号" />)}
					</Form.Item>
					<Form.Item label='收费站名称'>
						{getFieldDecorator('tollName', {
							initialValue: dataForm.tollName,
							rules: [
								{
									required: true,
									message: '请填写收费站名称',
								},
							],
						})(<Input allowClear placeholder="请填写收费站名称" />)}
					</Form.Item>
					<Form.Item label='地市'>
						{getFieldDecorator('cityId', {
							initialValue: dataForm.cityId,
							rules: [
								{
									required: true,
									message: '请选择地市',
								},
							],
						})(
							<Select allowClear placeholder="请选择地市" onChange={this.onCityChange}>
								{
									cityOptions.map(item => {
										return <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
									})
								}
							</Select>
						)}
					</Form.Item>
					<Form.Item label='所属路段'>
						{getFieldDecorator('roadId', {
							initialValue: dataForm.roadId,
							rules: [
								{
									required: true,
									message: '请选择所属路段',
								},
							],
						})(
							<Select allowClear placeholder="请选择所属路段" onChange={this.onRoadChange}>
								{
									roadOptions.map(item => {
										return <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
									})
								}
							</Select>
						)}
					</Form.Item>
				</Form>
			</BaseModal>
		)
	}
}
const UpdateModal = Form.create()(UpdateModalForm);
export default UpdateModal