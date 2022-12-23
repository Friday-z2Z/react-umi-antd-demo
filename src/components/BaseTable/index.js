import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { getTableScroll } from '@/utils/_';

// import styles from './index.less'

class BaseTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        
        const { extraHeight = 0 } = this.props;
        return (
            <Table
                scroll={{ y: getTableScroll({ extraHeight }) }}
                {...this.props}
            >
                {this.props.children}
            </Table>
        );
    }
}

export default BaseTable;

BaseTable.propTypes = {
    // 表头
    columns: PropTypes.array,
    // 数据源
    dataSource: PropTypes.array,
    // 额外高度 分页
    extraHeight: PropTypes.number,
    // 是否勾选
    selection: PropTypes.bool
};
