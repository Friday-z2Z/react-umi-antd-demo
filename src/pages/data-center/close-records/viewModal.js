/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Radio, Descriptions } from 'antd';
import { BaseModal, PageLoading, DPlayer } from '@/components';
import * as API_CLOSE_RECORDS from '@/services/data-center/close-records';
import * as API_COMMON from '@/services';
import styles from './index.less';

class ViewModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            loading: false,
            detail: {},
            value: ''
        };
    }

    static defaultProps = {
        value: '1'
    }

    componentDidMount() {
        this.props.onRef && this.props.onRef(this);
    }

    getDetail = async () => {
        this.setState({
            loading: true
        })
        const {
            dataForm: { id },
        } = this.props;
        const { data } = await API_CLOSE_RECORDS.getDetail({ id });
            this.setState({
                loading: false,
                detail: data,
                value: this.props.value
            });
    };

    handleChange = async({ target: { value } }) => {
        this.setState({
            value,
        });
        const { detail, detail:{ startVideo, tollId, cameraIp } } = this.state
        let video = '', flvVideo = ''
        if (value === '2') {
            if(startVideo.indexOf('?') > -1) {
                const { data:{ videoUrl } } = await API_COMMON.getVideoUrl(startVideo)
                video = videoUrl.replace(/http/,'ws')
            } else {
                video = startVideo
            }
        } else if (value === '3') {
            const { data } = await API_COMMON.getFlvUrl({
                tollId, cameraIp
            })
            flvVideo = data.replace(/http/,'ws')
        }
        this.setState({
            detail:{
                ...detail,
                video,
                flvVideo
            }
        })
    };

    render() {
        const {
            loading,
            detail: {
                startImage,
                tollName,
                eventCodeName,
                sceneName,
                laneName,
                isEnd,
                cameraName,
                cameraIp,
                startTime,
                endTimeStr,
                video,
                flvVideo
            },
            value,
        } = this.state;

        return (
            <BaseModal {...this.props} width={1100} title="详情" destroyOnClose footer={null}>
                {
                    loading ? <PageLoading style={{height: 400}} />: 
                    <div className={styles.viewModal}>
                        <div className={styles.view}>
                            {value === '1' && <img src={startImage} />}
                            {value === '2' && (
                                <DPlayer 
                                    id="video-player" 
                                    video={{
                                        url: video,
                                        loop: true
                                    }} 
                                    style={{width: '100%', height: '100%'}} 
                                />
                            )}
                            {value === '3' && (
                                <DPlayer 
                                    id="flv-player" 
                                    live={true} 
                                    video={{
                                        url: flvVideo,
                                    }} 
                                    style={{width: '100%', height: '100%'}} 
                                />
                            )}
                        </div>
                        <div className={styles.info}>
                            <Radio.Group value={value} buttonStyle="solid" onChange={this.handleChange}>
                                <Radio.Button value="1">抓拍图</Radio.Button>
                                <Radio.Button value="2">视频录像</Radio.Button>
                                <Radio.Button value="3">实时监控</Radio.Button>
                            </Radio.Group>
                            <Descriptions style={{marginTop: 10}} column={1} size="small" bordered>
                                <Descriptions.Item label="收费站名称">{tollName}</Descriptions.Item>
                                <Descriptions.Item label="事件类型">{eventCodeName}</Descriptions.Item>
                                <Descriptions.Item label="场景">{sceneName}</Descriptions.Item>
                                <Descriptions.Item label="位置">{laneName}</Descriptions.Item>
                                <Descriptions.Item label="是否结束">
                                    {isEnd === 2 ? '是' : '否'}
                                </Descriptions.Item>
                                <Descriptions.Item label="点位">{cameraName}</Descriptions.Item>
                                <Descriptions.Item label="点位IP">{cameraIp}</Descriptions.Item>
                                <Descriptions.Item label="发生时间">{startTime}</Descriptions.Item>
                                <Descriptions.Item label="结束时间">{endTimeStr}</Descriptions.Item>
                            </Descriptions>
                        </div>
                    </div>
                }
            </BaseModal>
        );
    }
}

export default ViewModal;
