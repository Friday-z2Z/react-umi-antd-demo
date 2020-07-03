/**
 * title: pageA
 */
import React from 'react'
import { Button, Message } from 'antd'
import styles from './index.less'

class pageA extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleClick = ()=>{
        Message.success('loaded!')
    }

    render() {
        return (
            <Button onClick={this.handleClick}>click</Button>
        );
    }
}

export default pageA;