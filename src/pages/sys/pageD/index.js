import React from 'react'
import { connect } from 'dva'
import { BaseTable } from '@/components'
import { pageNum, pageSize } from '@/config/platform.config'
import styles from './index.less'

// import styles from './index.less'

const columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
},
{
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
},
{
    title: '住址',
    dataIndex: 'address',
    key: 'address',
},]
class PageD extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            params:{
                pageNum,
                pageSize
            }
        }
    }

    componentDidMount(){
        this.loadTable()
    }

    pageOnChnage = (pagination, filters, sorter, extra)=>{
        const { params } = this.state;
        const { current } = pagination;
        const _params = {
            ...params,
            pageNum:current
        }
        this.setState({
            params:_params
        },()=>{
            this.loadTable()
        })
    }

    loadTable = ()=>{
        const { dispatch } = this.props;
        const { params } = this.state;
        dispatch({
            type:'pageDModel/getPageDData',
            payload:{
                ...params
            }
        })
    }

    render() {

        const { pageD_dataSource } = this.props;

        return (
            <div className={styles.table}>
                <BaseTable
                    columns={columns}
                    dataSource={pageD_dataSource} 
                    onChange={this.pageOnChnage}
                />
            </div>
        );
    }
}

export default connect(({ pageDModel })=>({
    ...pageDModel
}))(PageD);