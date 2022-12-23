import React, { Fragment } from 'react';
import { Menu, Dropdown, Button } from 'antd';
import styles from './index.less';

import { Tabs } from 'antd';
const { TabPane } = Tabs;

class CacheTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
    }

    onVisibleChange = visible => {
        this.setState({
            visible,
        });
    };

    onClick = ({ key: toMethod }) => {
        this[toMethod]();
        this.setState({
            visible: false,
        });
    };

    removeCurrent = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'menu/removeTab',
        });
    };

    removeOthers = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'menu/removeOthersTab',
        });
    };

    removeAll = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'menu/removeAllTab',
        });
    };

    renderTabs = () => {
        const {
            cacheRoutes,
            activeTabRoute: { pathname },
        } = this.props;
        const { visible } = this.state;
        const tabPanes = cacheRoutes.map(({ pathname, state }) => {
            const pathtitles = state?.pathtitles || {};
            return (
                <TabPane
                    tab={pathtitles ? pathtitles[pathtitles.length - 1] : ''}
                    key={pathname}
                ></TabPane>
            );
        });

        const disabled = cacheRoutes.length <= 1;

        const menu = (
            <Menu onClick={this.onClick}>
                <Menu.Item key="removeCurrent" disabled={disabled}>
                    关闭当前页面
                </Menu.Item>
                <Menu.Item key="removeOthers" disabled={disabled}>
                    关闭其他页面
                </Menu.Item>
                <Menu.Item key="removeAll" disabled={disabled}>
                    关闭所有页面
                </Menu.Item>
            </Menu>
        );
        return (
            <div className={styles.tabWrap}>
                <Tabs
                    hideAdd
                    className={styles.tabs}
                    type={cacheRoutes.length === 1 ? 'card' : 'editable-card'}
                    activeKey={pathname}
                    onTabClick={this.onTabClick}
                    onEdit={this.onEdit}
                >
                    {tabPanes}
                </Tabs>
                <Dropdown
                    overlay={menu}
                    trigger={['click']}
                    visible={visible}
                    onVisibleChange={this.onVisibleChange}
                >
                    <Button
                        className={styles.tabButton}
                        type="link"
                        icon={visible ? 'caret-up' : 'caret-down'}
                    />
                </Dropdown>
            </div>
        );
    };

    // 点击tab触发响应的动作remove 或者 add
    onEdit = (targetKey, action) => {
        this[action](targetKey);
    };

    onTabClick = targetKey => {
        const { cacheRoutes, dispatch, activeTabRoute } = this.props;
        if (activeTabRoute.pathname === targetKey) {
            return
        }
        const currentRoute = cacheRoutes.filter(({ pathname }) => pathname === targetKey)[0];
        // 设置当前tab页
        dispatch({
            type: 'menu/setCurrentTab',
            payload: {
                currentRoute,
            },
        });
    };

    remove = key => {
        const { cacheRoutes, dispatch } = this.props;
        const removeRoute = cacheRoutes.filter(({ pathname }) => pathname === key)[0];
        // 删除指定的tab页
        dispatch({
            type: 'menu/removeTab',
            payload: {
                removeRoute,
            },
        });
    };

    render() {
        const renderedTabs = this.renderTabs();
        return <Fragment>{renderedTabs}</Fragment>;
    }
}

export default CacheTabs;
