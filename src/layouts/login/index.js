import React from 'react';
import { connect } from 'dva';
import { Form, Icon, Input, Button } from 'antd';
import styles from './index.less';
import { defaultLoginName, defaultLoginPsw } from '@/config/platform.config';

class LoginForm extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
				this.props.dispatch({
					type:'global/login',
					payload: values
				})
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className={styles.loginBgWrapper}>
                <div className={styles.loginWrapper}>
                    <div className={styles.login}>
                        <p>高速公路收费站拥堵智能监测系统</p>
                        <div className={styles.content}>
                            <Form onSubmit={this.handleSubmit} className={styles.loginForm}>
                                <Form.Item>
                                    {getFieldDecorator('username', {
										initialValue: defaultLoginName,
                                        rules: [{ required: true, message: '请输入账号！' }],
                                    })(
                                        <Input
                                            size="large"
                                            prefix={
                                                <Icon
                                                    type="user"
                                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                                />
                                            }
                                            placeholder="请输入账号"
                                        />,
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('password', {
										initialValue: defaultLoginPsw,
                                        rules: [{ required: true, message: '请输入密码！' }],
                                    })(
                                        <Input
                                            size="large"
                                            prefix={
                                                <Icon
                                                    type="lock"
                                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                                />
                                            }
                                            type="password"
                                            placeholder="请输入密码"
                                        />,
                                    )}
                                </Form.Item>
                                <Button block size="large" type="primary" htmlType="submit">
                                    登 录
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
const WrappedLoginForm = Form.create({ name: 'login' })(LoginForm);
export default connect(({ global }) => ({
    ...global,
}))(WrappedLoginForm);
