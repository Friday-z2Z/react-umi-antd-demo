import React from 'react';
import * as echarts from 'echarts';
import * as API_SCREEN from '@/services/screen';
import styles from './index.less';

class TrafficFlow extends React.Component {
    componentDidMount() {
        this.getData();
    }

    getData = async () => {
        const res = await API_SCREEN.getTrafficFlowStatistical()
        const { yesterday: Y = [], lastDay: L = [] } = res?.data || {}
        const xData = Y.map(item => item.hour)
        const yYdata = Y.map(item => item.count)
        const lYdata = L.map(item => item.count)

        // const xData = [1, 2, 3];
        // const yYdata = [1, 2, 3];
        // const lYdata = [3, 2, 1];
        this.initChart(xData, yYdata, lYdata)
    };

    initChart = (xData, yYdata, lYdata) => {
        const that = this;
        this.myChart = echarts.init(document.getElementById('TrafficFlow'));
        window.addEventListener('resize', function() {
            that.myChart.resize();
        });
        let chartOption = {
            title: {
                top: '15px',
                left: '15px',
                text: '车流量',
                textStyle: {
                    align: 'center',
                    color: '#54D9F9',
                    fontSize: 20,
                },
            },
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                align: 'left',
                right: 20,
                y: '25px',
                icon: 'square',
                itemHeight: 10,
                itemWidth: 14,
                selectedMode: false,
                textStyle: {
                    color: '#f2f2f2',
                    fontSize: 12,
                },
                data: ['前日车流量', '昨日车流量'],
            },

            grid: {
                right: '6%',
                bottom: '8%',
                left: '5%',
                top: '100px',
                containLabel: true,
            },
            dataZoom: [
                {
                    type: 'inside',
                },
            ],
            xAxis: [
                {
                    type: 'category',
                    data: xData,
                    name: '',
                    nameTextStyle: {
                        color: '#d4ffff',
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#0B4CA9',
                        },
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#337CBF',
                            fontSize: 12,
                        },
                    },
                },
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '千辆',
                    nameTextStyle: {
                        color: '#d4ffff',
                    },
                    position: 'left',
                    axisLine: {
                        lineStyle: {
                            color: '#0B4CA9',
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'dashed',
                            color: 'rgba(11,76,169,0.5)',
                        },
                    },
                    axisLabel: {
                        color: '#337CBF',
                        fontSize: 12,
                    },
                },
            ],

            series: [
                {
                    name: '前日车流量',
                    type: 'line',
                    yAxisIndex: 0,
                    symbolSize: 5,
                    smooth: true,
                    itemStyle: {
                        color: '#00d59e',
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgba(0,213,158,0.6)',
                            },
                            {
                                offset: 1,
                                color: 'rgba(0,213,158,0.1)',
                            },
                        ]),
                    },
                    data: yYdata,
                },
                {
                    name: '昨日车流量',
                    type: 'line',
                    yAxisIndex: 0,
                    symbolSize: 5,
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#38c9f2',
                        },
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgba(56,201,242,0.6)',
                            },
                            {
                                offset: 1,
                                color: 'rgba(56,201,242,0.1)',
                            },
                        ]),
                    },
                    data: lYdata,
                },
            ],
        };
        this.myChart.setOption(chartOption);
    };

    render() {
        return <div id="TrafficFlow" className={styles.trafficFlow}></div>;
    }
}

export default TrafficFlow;
