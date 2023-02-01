import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import isEqual from 'lodash/isEqual';
import { getTableScroll } from '@/utils/_';

// import styles from './index.less'

class BaseTable extends React.Component {
    constructor(props) {
        super(props);
        const { extraHeight = 0 } = props
        this.state = {
            H: getTableScroll({ extraHeight })
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.reloadTable)
    }

    componentDidUpdate(preProps) {
        const { dataSource } = this.props;
        if (!isEqual(dataSource, preProps.dataSource)) {
            this.reloadTable();
        }
    }

    reloadTable = () => {
        const { extraHeight = 0 } = this.props
        this.setState({
            H: getTableScroll({ extraHeight })
        })
    }

    render() {
        // const { extraHeight = 0 } = this.props;
        const { H } = this.state
        return (
            <Table
                scroll={{ y: H }}
                pagination={false}
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
