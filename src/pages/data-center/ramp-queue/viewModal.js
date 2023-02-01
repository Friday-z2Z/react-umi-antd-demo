/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import * as echarts from 'echarts';
import { Timeline, Icon, Tag, Descriptions, Select } from 'antd';
import { BaseModal, DPlayer, PageLoading } from '@/components';
import classnames from 'classnames';
import * as API_RAMP_QUEUE from '@/services/data-center/ramp-queue';
import * as API_COMMON from '@/services';
import styles from './index.less';
class ViewModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            loading: false,
            detail: {},
            activeProcess: {},
            visible: false,
            previewImage: '',
            chartSelectValue: '2',
            videoUrl: ''
        };
    }

    static defaultProps = {
        options: [
            {
                label: '排队长度',
                value: '2',
            },
            {
                label: '预计通过时长',
                value: '3',
            },
        ],
    };

    componentDidMount() {
        this.props.onRef && this.props.onRef(this);
    }

    getDetail = async (withoutLoading = false) => {
        if (!withoutLoading) {
            this.setState({
                loading: true
            })
        }
        const { chartSelectValue } = this.state
        const {
            dataForm: { rampNo, eventId, scene },
        } = this.props;
        const {
            data,
            data: { processList = [] },
        } = await API_RAMP_QUEUE.getDetail({
            rampNo,
            eventId,
            scene,
            type: chartSelectValue,
        });

        this.setState({
            loading: false,
            detail: data,
            activeProcess: processList[0],
        }, () => {
            this.getVideo(processList[0])
            this.initChart();
        });
    };

    initChart = () => {
        const that = this;
        this.myChart = echarts.init(document.getElementById('rampQueueChart'));
        window.addEventListener('resize', function() {
            that.myChart.resize();
        });
        this.setChart();
    };

    getVideo = async(item) => {
        const { video } = item
        let url = ''
        if(video.indexOf('?') > -1) {
            const { data:{ videoUrl } } = await API_COMMON.getVideoUrl(video)
            url = videoUrl.replace(/http/,'ws')
        } else {
            url = video
        }
        this.setState({ videoUrl: url })
    }

    setChart = () => {
        const { detail: { lineChartList = [] }, chartSelectValue } = this.state
        this.myChart.setOption({
            tooltip: {
                trigger: 'axis',
            },
            grid: {
                bottom: 40,
                top: 40,
                left: '5%',
                right: '5%'
            },
            xAxis: {
                type: 'category',
                data: lineChartList.map(item => item.label),
                axisLabel: {
                    fontSize: 14,
                },
                axisTick: {
                    show: false,
                }
            },
            dataZoom: [
                {
                    type: 'inside',
                },
            ],
            yAxis: {
                type: 'value',
                name: chartSelectValue === '2' ? '(米)' : '(分钟)',
                nameTextStyle: {
                    fontSize: 14,
                },
                axisLine: {
                    show: false,
                },
                axisLabel: {
                    fontSize: 14,
                },
                axisTick: {
                    show: false,
                }
            },
            series: [
                {
                    data: lineChartList.map(item => item.value),
                    type: 'line',
                },
            ],
        });
    };

    setActiveProcess = activeProcess => {
        this.getVideo(activeProcess)
        this.setState({
            activeProcess: activeProcess,
        });
    };

    previewImage = previewImage => {
        this.setState({
            previewImage,
            visible: true,
        });
    };

    cancelPreview = () => {
        this.setState({
            previewImage: '',
            visible: false,
        });
    };

    handleChange = value => {
        this.setState({
            chartSelectValue: value,
        }, () => {
            this.getDetail(true)
        });
    };

    render() {
        const {
            loading,
            detail: {
                tollName = '',
                rampName = '',
                laneName = '',
                eventName = '',
                reason = '',
                processList = [],
            },
            activeProcess,
            visible,
            previewImage,
            chartSelectValue,
            videoUrl
        } = this.state;
        const { options } = this.props;
        return (
            <BaseModal
                {...this.props}
                width={1100}
                title={tollName + '--' + rampName + '--' + laneName}
                destroyOnClose
                footer={null}
            >
                {
                    loading ? <PageLoading style={{height: 600}} /> :
                    <div className={styles.viewModal}>
                        <Timeline className={styles.timeline}>
                            {processList.map(item => {
                                return (
                                    <Timeline.Item
                                        key={item.processId}
                                        color={
                                            activeProcess.processId !== item.processId ? 'gray' : 'blue'
                                        }
                                        className={classnames(
                                            styles.process,
                                            activeProcess.processId === item.processId
                                                ? styles.activeProcess
                                                : null,
                                        )}
                                    >
                                        <p
                                            className={styles.processTitle}
                                            onClick={() => this.setActiveProcess(item)}
                                        >
                                            {item.startTime}{' '}
                                            <Icon type="double-right" style={{ marginLeft: '5px' }} />
                                        </p>
                                        <Tag
                                            color={
                                                item.level === 1
                                                    ? '#d89d0d'
                                                    : item.level === 3
                                                    ? '#ff4d4f'
                                                    : item.level === 2
                                                    ? '#f50'
                                                    : '#87d068'
                                            }
                                        >
                                            {item.levelName}
                                        </Tag>
                                        <img
                                            src={item.image}
                                            onClick={() => this.previewImage(item.image)}
                                        />
                                    </Timeline.Item>
                                );
                            })}
                        </Timeline>
                        <div className={styles.content}>
                            <div className={styles.title}>视频回放</div>
                            <div className={styles.videoInfo}>
                                <div className={styles.player}>
                                    <DPlayer 
                                        id="video-player" 
                                        video={{
                                            url: videoUrl,
                                            loop: true
                                        }} 
                                        style={{width: '100%', height: '100%'}} 
                                    />
                                </div>
                                <Descriptions column={1} bordered className={styles.descriptions}>
                                    <Descriptions.Item label="发生时间">
                                        {activeProcess.startTime}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="排队等级">
                                        <Tag
                                            color={
                                                activeProcess.level === 1
                                                    ? '#d89d0d'
                                                    : activeProcess.level === 3
                                                    ? '#ff4d4f'
                                                    : activeProcess.level === 2
                                                    ? '#f50'
                                                    : '#87d068'
                                            }
                                        >
                                            {activeProcess.levelName}
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="排队位置">{eventName}</Descriptions.Item>
                                    <Descriptions.Item label="原因分析">{reason}</Descriptions.Item>
                                </Descriptions>
                            </div>
                            <div className={styles.title}>
                                <span>排队变化情况</span>
                                <Select
                                    value={chartSelectValue}
                                    onChange={this.handleChange}
                                    style={{ width: 200 }}
                                >
                                    {options.map(item => {
                                        return (
                                            <Select.Option key={item.value} value={item.value}>
                                                {item.label}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </div>
                            <div id="rampQueueChart" className={styles.rampQueueChart}></div>
                        </div>
                        <BaseModal
                            visible={visible}
                            title="图片查看"
                            onCancel={this.cancelPreview}
                            fullscreen={true}
                            footer={null}
                        >
                            <img
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                src={previewImage}
                            />
                        </BaseModal>
                    </div>
                }
            </BaseModal>
        );
    }
}

export default ViewModal;
