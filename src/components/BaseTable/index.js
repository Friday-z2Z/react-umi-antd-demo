import React from 'react'
import PropTypes from 'prop-types';
import { Table } from 'antd'
import styles from './index.less'

class BaseTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {


        return (
            <Table {...this.props} >{ this.props.children }</Table>
        );
    }
}

export default BaseTable;

BaseTable.propTypes = {
    // 表头
    columns: PropTypes.array,
    // 数据源
    dataSource: PropTypes.array,
}
