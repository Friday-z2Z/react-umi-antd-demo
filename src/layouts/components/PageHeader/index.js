import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Avatar, Menu, Dropdown, Modal, Form, Input, Button, message } from 'antd';
import { BaseModal } from '@/components';
import * as API_COMMON from '@/services';
import { formItemLayout } from '@/config/formLayout.config';
import styles from './index.less';

class PageHeader extends React.Component {

    state = {
        visible: false,
        loading: false
    }

    handleClick = ({ key }) => {
        this[key]();
    };

    editPsw = async() => {
        // const res = await API_COMMON.changePassword()
        this.setState({
            visible: true
        })
    };

    logout = () => {
        const that = this
        Modal.confirm({
            title: `确认退出吗？`,
            centered: true,
            onOk() {
                that.props.dispatch({
                    type: 'global/logout',
                });
            },
        });
    };

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('newPassword')) {
            callback('确认密码与新密码不一致');
        } else {
            callback();
        }
    };

    handleCancel = () => {
        this.setState({ visible: false })
    }

    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ loading: true })
                API_COMMON.changePassword(values).then(() => {
                    message.success('密码修改成功')
                    this.setState({ visible: false })
                    this.props.dispatch({
                        type: 'global/logout',
                    });
                }).finally(() => {
                    this.setState({ loading: false })
                })
            }
        });
    }

    render() {
        const {
            children,
            user: { username },
            style,
            prefix,
            form: { getFieldDecorator },
        } = this.props;
        const { visible, loading } = this.state
        const menu = (
            <Menu onClick={this.handleClick}>
                <Menu.Item key="editPsw">修改密码</Menu.Item>
                <Menu.Item key="logout">退出</Menu.Item>
            </Menu>
        );
        return (
            <div className={styles.pageHeader} style={style}>
                <Fragment>
                    {prefix}
                    <div className={styles.user}>
                        {children}
                        <Dropdown overlay={menu} trigger={['click']}>
                            <Avatar
                                className={styles.avatar}
                                icon="user"
                            />
                        </Dropdown>
                        {username}
                    </div>
                </Fragment>
                <BaseModal
                    {...this.props}
                    title='修改密码'
                    visible={visible}
                    destroyOnClose
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            取 消
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                            确 定
                        </Button>
                    ]}
                >
                    <Form {...formItemLayout} autoComplete="off">
                        <Form.Item label='原密码'>
                            {getFieldDecorator('password', {
                                rules: [
                                    {
                                        required: true,
                                        message: '原密码不能为空',
                                    }
                                ],
                            })(<Input.Password allowClear placeholder="请填写原密码" />)}
                        </Form.Item>
                        <Form.Item label='新密码'>
                            {getFieldDecorator('newPassword', {
                                rules: [
                                    {
                                        required: true,
                                        message: '新密码不能为空',
                                    },
                                    {
                                        pattern: /^(?![A-Za-z0-9]+$)(?![a-z0-9\W]+$)(?![A-Za-z\W]+$)(?![A-Z0-9\W]+$)[a-zA-Z0-9\W]{8,14}$/,
                                        message: '密码必须是包含大写字母、小写字母、数字、特殊符号的8-14位组合'
                                    }
                                ],
                            })(<Input.Password allowClear placeholder="请填写新密码" />)}
                        </Form.Item>
                        <Form.Item label='确认密码'>
                            {getFieldDecorator('confirmPassword', {
                                rules: [
                                    {
                                        required: true,
                                        message: '确认密码不能为空',
                                    },
                                    {
                                        validator: this.compareToFirstPassword
                                    }
                                ],
                            })(<Input.Password allowClear />)}
                        </Form.Item>
                    </Form>
                </BaseModal>
            </div>
        );
    }
}

const PageHeaderWapper = Form.create()(PageHeader)
export default connect(({ global }) => ({
    ...global,
}))(PageHeaderWapper);
