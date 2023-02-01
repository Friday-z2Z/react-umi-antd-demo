import React, { PureComponent } from 'react';
import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { Link } from 'umi';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { isURL } from '@/utils/validate'
import './index.less'

import { Menu } from 'antd';
import { BaseIcon, Consumer } from '@/components';
import { queryKeysByPath, testMenusData } from './_';

const { SubMenu, Item } = Menu;

class MainMenu extends PureComponent {
    constructor(props) {
        super(props);
        this.renderMenu = memoizeOne(this.renderMenu, isEqual);
    }

    static defaultProps = {
        mode: "inline",
        menuTheme: 'dark'
    };

    renderMenu(data = [], pathtitles = []) {
        const rows = Array.isArray(data) ? data : data.rows;
        const self = this;
        const { mode } = this.props;
        return rows.map((row) => {
            if (row === undefined) return false;
            const { name, url = "", menuId = '', query, icon = "bars", list, ...restState } = row;
            if (list && list.length > 0) {
                const subMenu = self.renderMenu(list, pathtitles.concat(name));
                return (
                    <SubMenu
                        key={menuId}
                        text={name}
                        title={<span><BaseIcon type={icon} />{mode === 'inline' ? <span>{name}</span> : null}</span>}
                    >
                        {subMenu}
                    </SubMenu>
                );
            } else {
                if (isURL(url)) {
                    return (
                        <Item
                            key={url}
                            text={name}
                        >
                            <Link to={{ pathname: '/iframe/' + menuId, title:name, state: { ...restState, key:url, menuId, pathtitles: pathtitles.concat(name) } }}>
                                <BaseIcon type={icon}/>
                                <span>{name}</span>
                            </Link>
                        </Item>
                    );
                }
                return (
                    <Item
                        key={url}
                        text={name}
                    >
                        <Link to={{ pathname: url, title:name, state: { ...restState, key:url, menuId, pathtitles: pathtitles.concat(name) } }}>
                            <BaseIcon type={icon}/>
                            <span>{name}</span>
                        </Link>
                    </Item>
                );
            }
        });
    }

    onOpenChange = (openKeys) => {
        this.props.dispatch({
            type: 'menu/setOpenKeys',
            payload: {
                openKeys
            }
        })
    }

    render() {
        const { defaultKey, menuTheme, menusData, mode, activeTabRoute, openKeys } = this.props;
        const { pathname, state: pathState } = activeTabRoute;
        const menus = this.renderMenu(menusData);
        // 当前选中的菜单key
        const { key } = pathState || queryKeysByPath(pathname, menusData);
        return (
            <Menu
                selectedKeys={[key || defaultKey]}
                openKeys={openKeys}
                mode={mode}
                theme={menuTheme}
                onOpenChange={this.onOpenChange}
                style={{ overflowY: 'auto', fontSize:'20px', height: "calc(100vh - 70px)" }}
            >
                {menus}
            </Menu>
        );
    }
}
export default connect(({ menu }) => ({ ...menu }))(Consumer(MainMenu));

MainMenu.propTypes = {
    menusData: PropTypes.arrayOf(function (propValue, key, componentName, location, propFullName) {
        const err = () => new Error(
            'Invalid prop `' + propFullName + '` supplied to' +
            ' `' + componentName + '`. Validation failed.'
        );
        testMenusData(propValue[key], err);
    })
}