import React from 'react';
import * as echarts from 'echarts';
import { province } from './province';
import styles from './index.less';

class Map extends React.Component {

    constructor(props) {
        super()
        this.state = {
            pointData: [], // 渲染点的集合
        }
        this.myChart = null
    }

    componentDidMount() {
        this.props.onRef && this.props.onRef(this);
        this.initMap();
    }

    renderNavData = (data) => {
        // 渲染点
        this.setState({
            pointData: data
        }, () => {
            this.setOption();
        })
    }

    initMap = () => {
        const that = this
        echarts.registerMap('chinaMap', province.dataMap);
        this.myChart = echarts.init(document.getElementById('map'));
        window.addEventListener('resize', function() {
            that.myChart.resize();
        });
        this.setOption()
    };

    setOption = () => {
        const { pointData } = this.state
        let series = [
            {
                map: 'chinaMap',
                type: 'map',
                zoom: 1.1,
                layoutSize: '74%',
                aspectScale: 1,
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: '#00C8F2',
                        },
                    },
                    emphasis: {
                        textStyle: {
                            color: '#00C8F2',
                        },
                    },
                },
                tooltip: {
                    show: false,
                },
                select: {
                    label: {
                        show: true,
                        color: 'yellow',
                    },
                    itemStyle: {
                        areaColor: {
                            type: 'radial',
                            x: 0.5,
                            y: 0.5,
                            r: 0.8,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: '#0c449e',
                                },
                                {
                                    offset: 1,
                                    color: '#05214b',
                                },
                            ],
                            global: false,
                        },
                    },
                },
                roam: false,
                itemStyle: {
                    normal: {
                        borderColor: '#146fb8',
                        borderWidth: 2,
                        areaColor: {
                            type: 'radial',
                            x: 0.5,
                            y: 0.5,
                            r: 0.8,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: '#0c449e',
                                },
                                {
                                    offset: 1,
                                    color: '#05214b',
                                },
                            ],
                            global: false,
                        },
                    },
                    emphasis: {
                        areaColor: {
                            type: 'radial',
                            x: 0.5,
                            y: 0.5,
                            r: 0.8,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: '#0c449e',
                                },
                                {
                                    offset: 1,
                                    color: '#062552',
                                },
                            ],
                            global: false,
                        },
                        shadowColor: '#22a1fc',
                        shadowOffsetX: 0,
                        shadowOffsetY: 4,
                        shadowBlur: 20,
                    },
                },
            },
            // 地图标点
            {
                type: 'scatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: {
                    period: 4,
                    brushType: 'stroke',
                    scale: 4,
                },
                label: {
                    //标签样式设置
                    normal: {
                        show: false,
                        position: [-5, -20],
                        // formatter:function(params){ //标签内容
                        //   if(localStorage.getItem('buildType') === 'zs') return  '舟山市'
                        //   else return  '义乌市'
                        // },
                        lineHeight: 20,
                        backgroundColor: 'rgb(255,171,34)',
                        // borderColor:'#80cffd',
                        borderWidth: '1',
                        padding: [5, 15, 4],
                        color: '#fff',
                        fontSize: 16,
                        fontWeight: 'bold',
                    },
                },
                symbol: 'pin',
                symbolSize: 50,
                data: pointData,
            },
        ];
        const option = {
            backgroundColor: 'transparent',
            color: ['#34c6bb'],
            geo: {
                silent: true,
                map: 'chinaMap',
                zoom: 1.1,
                layoutSize: '80%',
                aspectScale: 1,
                label: {
                    normal: {
                        show: false,
                        textStyle: {
                            color: '#fff',
                        },
                    },
                    emphasis: {
                        textStyle: {
                            color: '#fff',
                        },
                    },
                },

                roam: false,
                itemStyle: {
                    normal: {
                        areaColor: {
                            type: 'radial',
                            x: 0.5,
                            y: 0.5,
                            r: 0.8,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: '#07337B',
                                },
                                {
                                    offset: 1,
                                    color: '#062552',
                                },
                            ],
                            global: false,
                        },
                        borderColor: '#1E5D88',
                        borderWidth: 1.5,
                        shadowColor: '#1E5D88',
                        shadowOffsetX: 0,
                        shadowOffsetY: 4,
                        shadowBlur: 10,
                    },
                    emphasis: {
                        areaColor: 'transparent', //悬浮背景
                        textStyle: {
                            color: '#fff',
                        },
                    },
                },
            },
            series,
        };
        this.myChart.setOption(option);
        this.myChart.off('click')
        this.myChart.on('click', res => {
            console.log('---map click----', res);
        });
    }

    render() {
        return (
            <div id="map" className={styles.map}>
                1
            </div>
        );
    }
}

export default Map;
