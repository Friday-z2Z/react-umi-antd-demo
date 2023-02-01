import React from 'react';
import { Form, Input, Button, message, Modal } from 'antd';
import { BaseModal } from '@/components'
import { formItemLayout } from '@/config/formLayout.config';
import * as API_TOLL from '@/services/sys/toll';
import { downloadExcelFile } from '@/utils/tool'

class ParamModalForm extends React.Component {
	constructor(props) {
		super()
		this.state = {
            exportLoading: false,
            dataForm: {},
            resetLoading: false
        }
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

    getDetail = async(tollId) => {
        const { data } = await API_TOLL.getDetail(tollId)
        this.setState({ dataForm: data })
    }

    handleExport = async() => {
        const { dataForm: { tollId } } = this.state
        this.setState({ exportLoading: true })
        const res = await API_TOLL.tollSignExport(tollId)
        this.setState({
            exportLoading: false
        })
        downloadExcelFile(res.data, decodeURIComponent(res.headers['content-disposition'].split('=')[1]))
    }

    handleReset = () => {
        const that = this
        const { dataForm: { tollId } } = this.state
        Modal.confirm({
            title: `确定对【${tollId}】进行【重置密钥】操作?`,
            centered: true,
            onOk() {
                that.setState({ resetLoading: true })
                API_TOLL.tollSignReset(tollId).then(res => {
                    message.success('密钥重置成功')
                    that.setState({ dataForm: res.data })
                }).finally(() => {
                    that.setState({ resetLoading: false })
                })
            },
        });
    }

	render() {
		const {
            form: { getFieldDecorator }
        } = this.props;
        const { dataForm, exportLoading, resetLoading } = this.state
		return (
			<BaseModal
                {...this.props}
                title='对接参数'
                destroyOnClose
                footer={[
                    <Button key="export" loading={exportLoading} onClick={this.handleExport}>
                        导 出
                    </Button>,
                    <Button key="submit" type="primary" loading={resetLoading} onClick={this.handleReset}>
                        重置密钥
                    </Button>
                ]}
            >
				<Form {...formItemLayout} autoComplete="off">
					<Form.Item label='AppId'>
						{getFieldDecorator('appId', {
							initialValue: dataForm.appId,
						})(<Input disabled={true} />)}
					</Form.Item>
					<Form.Item label='API秘钥'>
						{getFieldDecorator('apiKey', {
							initialValue: dataForm.apiKey,
						})(<Input disabled={true} />)}
					</Form.Item>
                    <Form.Item label='TollId'>
						{getFieldDecorator('tollId', {
							initialValue: dataForm.tollId,
						})(<Input disabled={true} />)}
					</Form.Item>
                    <Form.Item label='TollName'>
						{getFieldDecorator('tollName', {
							initialValue: dataForm.tollName,
						})(<Input disabled={true} />)}
					</Form.Item>
                    <Form.Item label='CityId'>
						{getFieldDecorator('cityCode', {
							initialValue: dataForm.cityCode,
						})(<Input disabled={true} />)}
					</Form.Item>
                    <Form.Item label='HighwayId'>
						{getFieldDecorator('roadCode', {
							initialValue: dataForm.roadCode,
						})(<Input disabled={true} />)}
					</Form.Item>
                    <Form.Item label='GateWay'>
						{getFieldDecorator('gateWay', {
							initialValue: dataForm.gateWay,
						})(<Input disabled={true} />)}
					</Form.Item>
				</Form>
			</BaseModal>
		)
	}
}
const ParamModal = Form.create()(ParamModalForm);
export default ParamModal