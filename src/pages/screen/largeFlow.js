import React from 'react';
import * as echarts from 'echarts';
import * as API_SCREEN from '@/services/screen';
import styles from './index.less';

class LargeFlow extends React.Component {
    componentDidMount() {
        this.getData();
    }

    getData = async () => {
        // const res = await API_SCREEN.getTrafficRank()
        // const arr = res?.data || []
        // const data = arr.map(item => item.cntTotal)
        // const yData = arr.map(item => item.stationName)

        const data = [1, 2, 3];
        const yData = ['下沙收费站', '萧山收费站', '北仑收费站'];
        this.initChart(data, yData);
    };

    initChart = (data, yData) => {
        const that = this;
        this.myChart = echarts.init(document.getElementById('LargeFlow'));
        window.addEventListener('resize', function() {
            that.myChart.resize();
        });
        let chartOption = {
            legend: {
                selectedMode: false,
                show: false,
            },
            grid: {
                left: '8%',
                right: '12%',
                bottom: '2%',
                top: 5,
                containLabel: true,
            },
            xAxis: {
                type: 'value',
                show: false,
            },
            yAxis: [
                {
                    splitLine: {
                        show: false,
                    },
                    axisLine: {
                        // y轴
                        show: false,
                    },
                    type: 'category',
                    inverse: true, /// 柱状图顺序
                    axisTick: {
                        show: false,
                    },
                    data: yData,
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#54d9f9',
                        },
                    },
                },
            ],
            series: [
                {
                    name: '标准化',
                    type: 'bar',
                    barWidth: 10, // 柱子宽度
                    label: {
                        show: true,
                        position: 'right', // 位置
                        color: '#54d9f9',
                        fontSize: 14,
                        distance: 5, // 距离
                    }, // 柱子上方的数值
                    itemStyle: {
                        barBorderRadius: [20, 20, 20, 20],
                        color: new echarts.graphic.LinearGradient(
                            0,
                            0,
                            1,
                            0,
                            ['#0B1C3D', '#0DC0FE'].map((color, offset) => ({
                                color,
                                offset,
                            })),
                        ), // 渐变
                    },
                    data: data,
                },
            ],
        };
        this.myChart.setOption(chartOption);
    };

    render() {
        return (
            <div className={styles.largeFlowWrap}>
                <div className={styles.title}>大流量收费站</div>
                <div id="LargeFlow" className={styles.largeFlow}></div>
            </div>
        );
    }
}

export default LargeFlow;
