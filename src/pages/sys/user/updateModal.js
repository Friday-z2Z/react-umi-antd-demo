import React from 'react';
import { Form, Input, Radio, Button, message } from 'antd';
import { BaseModal } from '@/components'
import { formItemLayout } from '@/config/formLayout.config';
import * as API_USER from '@/services/sys/user';
import * as VALIDATE from '@/utils/validate'

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class UpdateModalForm extends React.Component {
	constructor(props) {
		super()
		this.state = {
            dataForm: {},
            roleList: [],
            loading: false
        }
	}

	componentDidMount() {
        this.props.onRef && this.props.onRef(this);
    }

	handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                
            }
        });
    };

    getDetail = async(userId) => {
        const { list } = await API_USER.roleSelectList()
        let info = {}
        if (userId) {
            const { user = {} } = await API_USER.getDetail(userId)
            info = {...user, userName: user.username}
        }
        this.setState({ dataForm: {...info, roleIdList: parseInt((info.roleIdList||[]).toString())}, roleList: list })
    }

    validatePassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && !VALIDATE.isPsw(form.getFieldValue('newPassword'))) {
            callback('密码必须是包含大写字母、小写字母、数字、特殊符号的8-14位组合');
        } else {
            callback();
        }
    }

    validateEmail = (rule, value, callback) => {
        const { form } = this.props;
        if (value && !VALIDATE.isEmail(form.getFieldValue('email'))) {
            callback('邮箱格式错误');
        } else {
            callback();
        }
    }

    validateMobile = (rule, value, callback) => {
        const { form } = this.props;
        if (value && !VALIDATE.isMobile(form.getFieldValue('mobile'))) {
            callback('手机号格式错误');
        } else {
            callback();
        }
    }

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('newPassword')) {
            callback('确认密码与新密码不一致');
        } else {
            callback();
        }
    };

    onOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { roleIdList, userName, newPassword, ...rest } = values
                const { dataForm } = this.state
                const params = {
                    ...dataForm,
                    username: userName,
                    roleIdList: [roleIdList],
                    password: newPassword,
                    ...rest
                }
                this.setState({ loading: true })
                API_USER.userAdd(params).then(() => {
                    message.success(`${dataForm.userId?'修改':'新增'}成功`)
                    this.props.onOk()
                }).finally(() => {
                    this.setState({ loading: false })
                })
            }
        });
    }

	render() {
		const {
            form: { getFieldDecorator, getFieldsError }
        } = this.props;
        const { dataForm, roleList, loading } = this.state
		return (
			<BaseModal
                {...this.props}
                title={dataForm.userId ? '修改' : '新增'}
                destroyOnClose
                onOk={this.onOk}
                footer={[
                    <Button key="back" onClick={this.props.onCancel}>
                        取 消
                    </Button>,
                    <Button key="submit" type="primary" loading={loading} disabled={hasErrors(getFieldsError())} onClick={this.onOk}>
                        确 定
                    </Button>
                ]}
            >
				<Form {...formItemLayout} autoComplete="off">
					<Form.Item label='用户名'>
						{getFieldDecorator('userName', {
							initialValue: dataForm.userName,
                            rules: [
                                {
                                    required: true,
                                    message: '用户名不能为空',
                                },
                            ]
						})(<Input allowClear placeholder='请填写登录帐号' />)}
					</Form.Item>
                    <Form.Item label='密码'>
                        {getFieldDecorator('newPassword', {
                            rules: [
                                {
                                    required: !dataForm.userId,
                                    message: '密码不能为空',
                                },
                                {
                                    validator: this.validatePassword
                                }
                            ],
                        })(<Input.Password allowClear placeholder="请填写密码" />)}
                    </Form.Item>
                    <Form.Item label='确认密码'>
                        {getFieldDecorator('confirmPassword', {
                            rules: [
                                {
                                    required: !dataForm.userId,
                                    message: '确认密码不能为空',
                                },
                                {
                                    validator: this.compareToFirstPassword
                                }
                            ],
                        })(<Input.Password allowClear />)}
                    </Form.Item>
                    <Form.Item label='邮箱'>
                        {getFieldDecorator('email', {
                            initialValue: dataForm.email,
                            rules: [
                                {
                                    required: true,
                                    message: '邮箱不能为空',
                                },
                                {
                                    validator: this.validateEmail
                                }
                            ],
                        })(<Input allowClear />)}
                    </Form.Item>
                    <Form.Item label='手机号'>
                        {getFieldDecorator('mobile', {
                            initialValue: dataForm.mobile,
                            rules: [
                                {
                                    required: true,
                                    message: '手机号不能为空',
                                },
                                {
                                    validator: this.validateMobile
                                }
                            ],
                        })(<Input allowClear />)}
                    </Form.Item>
                    <Form.Item label='角色'>
                        {getFieldDecorator('roleIdList', {
                            initialValue: dataForm.roleIdList,
                        })(
                            <Radio.Group>
                                {
                                    roleList.map(({ roleId, roleName }) => {
                                        return <Radio key={roleId} value={roleId}>{ roleName }</Radio>
                                    })
                                }
                            </Radio.Group>
                        )}
                    </Form.Item>
                    <Form.Item label='状态'>
                        {getFieldDecorator('status', {
                            initialValue: dataForm.status,
                        })(
                            <Radio.Group>
                                <Radio value={0}>禁用</Radio>
                                <Radio value={1}>正常</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
				</Form>
			</BaseModal>
		)
	}
}
const UpdateModal = Form.create()(UpdateModalForm);
export default UpdateModal