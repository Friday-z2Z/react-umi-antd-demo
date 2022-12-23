import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Avatar, Menu, Dropdown, Modal } from 'antd';
import styles from './index.less';

class PageHeader extends React.Component {
    handleClick = ({ key }) => {
        this[key]();
    };

    editPsw = () => {};

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

    render() {
        const {
            children,
            user: { username },
        } = this.props;
        const menu = (
            <Menu onClick={this.handleClick}>
                <Menu.Item key="editPsw">修改密码</Menu.Item>
                <Menu.Item key="logout">退出</Menu.Item>
            </Menu>
        );
        return (
            <div className={styles.pageHeader}>
                <Fragment>
                    {children}
                    <div className={styles.user}>
                        <Dropdown overlay={menu} trigger={['click']}>
                            <Avatar
                                className={styles.avatar}
                                icon="user"
                            />
                        </Dropdown>
                        {username}
                    </div>
                </Fragment>
            </div>
        );
    }
}
export default connect(({ global }) => ({
    ...global,
}))(PageHeader);
