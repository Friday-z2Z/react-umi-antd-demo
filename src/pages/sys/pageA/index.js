/**
 * title: pageA
 */
import React from 'react'
import { Button, Message } from 'antd'
import Context from '@/layouts/Context';
// import { connect } from 'echarts';
// import styles from './index.less'

// import { add } from './math'
class pageA extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    // 上下文
    // static contextType = Context

    handleClick = ()=>{

        import('./math').then(math=>{
            Message.success(math.add(1,2))
            // Message.success(this.context.location.pathname)
        })
    }

    render() {
        return (
            <Button onClick={this.handleClick}>click</Button>
        );
    }
}

// pageA.contextType = Context
export default pageA;