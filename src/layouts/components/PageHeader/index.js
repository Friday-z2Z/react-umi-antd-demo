import React, { Fragment } from 'react'
import { getNowFormatTime } from '@/utils/_'
import styles from './index.less'

class PageHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: getNowFormatTime()
        }
    }

    componentDidMount() {
        this.timer = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    tick = () => {
        this.setState({
            date: getNowFormatTime()
        });
    }

    render() {
        const { date } = this.state
        const { children } = this.props
        const currentTime = (
            <div className={styles.currentTime}>
                { date }
            </div>
        )
        return (
            <div className={styles.pageHeader}>
                <Fragment>
                    { children }
                    { currentTime }
                </Fragment>
            </div>
        );
    }
}

export default PageHeader;