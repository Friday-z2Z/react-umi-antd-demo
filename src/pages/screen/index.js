import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import classNames from 'classnames';
import { Layout, Row, Col } from 'antd';
import { sysScreenName } from '@/config/platform.config'
import { BaseIcon } from '@/components';
import BaseMap from './map'
import TrafficFlow from './trafficFlow'
import LargeFlow from './largeFlow'
import PageHeader from '@/layouts/components/PageHeader';
import styles from './index.less'
import * as API_SCREEN from '@/services/screen';

const icons = {
    0: 'image://' + require('@/assets/screen/location_icon_close.png'),
    1: 'image://' + require('@/assets/screen/location_icon_yellow_map.png'),
    2: 'image://' + require('@/assets/screen/location_icon_busy.png'),
    3: 'image://' + require('@/assets/screen/location_icon_Congestion.png')
}

const { Header, Content } = Layout;

class Screen extends React.Component {

    constructor(props) {
        super();
        this.state = {
            alarmData: [{
                alarmType: '严重拥堵' 
            },{
                alarmType: '一般拥堵' 
            },{
                alarmType: '拥堵预警' 
            },{
                alarmType: '暂时关闭' 
            }],
            toggleVisible: false,
            congestionInfo: {}
        }
    }

    static defaultProps = {
        colors: ['#666666', '#d89d0d', '#e6522c', '#e40a05']
    }

    componentDidMount() {
        API_SCREEN.getAlarm().then(res => {
            this.setState({
                alarmData: res.data || [],
                congestionInfo: res?.data[0] || {}
            })
        })
    }

    renderNav = (data = []) => {
        const { colors } = this.props
        const lis = data.map((item,index) => {
            return (
                <li key={index} style={{color: colors[item.alarm]}} onClick={() => this.navClick(item)}>
                    <span className={styles.navName}>{ item.alarmType }</span>
                    <span className={styles.navCount}>{ item.alarmCount || '0' }</span>
                    个
                </li>
            )
        })
        return <ul>{ lis }</ul>
    }

    navClick = (item) => {
        const { alarmTollList: L = [] } = item
        const arr = (L && L.length > 0) ? L.map(o => {
            return {
                tollId: o.tollId,
                value: [o.longitude, o.latitude],
                symbol: icons[item.alarm],
            }
        }) : []
        this.map.renderNavData(arr)
        this.setState({
            congestionInfo: item,
            toggleVisible: true,
            // congestionInfo: {
            //     alarm: 1,
            //     alarmTollList: [
            //         {tollName: '174收费站', duration: 30267}
            //     ],
            //     alarmType: '一般拥堵'
            // },
        })
    }

    render() {
        const { alarmData, toggleVisible, congestionInfo: { alarmType, alarm = '0', alarmTollList = [] } } = this.state
        const { colors } = this.props
        const navDom = this.renderNav(alarmData)
        return (
            <Layout className={styles.screen}>
                <Header>
                    <div className={styles.headerWrap}>
                        <div className={styles.title}>
                            <font>{ sysScreenName }</font>
                        </div>
                        <PageHeader {...this.props} style={{ justifyContent: 'flex-end', padding: 0, color: '#fff' }}>
                            <BaseIcon className={styles.switchIcon} style={{ fontSize: '32px' }} type="shouye" onClick={() => router.push('/')}/>
                        </PageHeader>
                    </div>
                </Header>
                <Content className={styles.layoutContent}>
                    <Row gutter={20}>
                        <Col span={16} className={styles.layoutCol}>
                            <div className={classNames(styles.main, styles.item)}>
                                <div className={styles.nav}>
                                    { navDom }
                                </div>
                                <div className={styles.mapWrap}>
                                    <BaseMap onRef={node => (this.map = node)}/>
                                    {/* 展开的拥堵情况 */}
                                    <div className={classNames([styles.toggle, toggleVisible ? styles.toggled : ''])}>
                                        <span className={styles.toggleIcon} onClick={() => this.setState({toggleVisible: !toggleVisible })}></span>
                                        <div className={styles.title} style={{color: colors[alarm]}}>{ alarmType }</div>
                                        <div className={styles.congestion}>
                                            {
                                                alarmTollList.map(item => {
                                                    return (
                                                        <div className={styles.congestionItem}>
                                                            <span>{item.tollName}</span>
                                                            <span>持续:<span style={{color: colors[alarm]}}>{item.duration}</span>分钟</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col span={8} className={styles.layoutCol}>
                            <TrafficFlow />
                            <div className={styles.rest}>
                                <Row gutter={20}>
                                    <Col span={12}>
                                        {/* 车流量 */}
                                    </Col>
                                    <Col span={12}>
                                        <LargeFlow />
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    {/* 实时缩略图进度条 */}
                    {/* 拥堵情况展示 */}
                </Content>
            </Layout>
        )
    }
}

export default connect(({ global }) => ({
    ...global,
}))(Screen);