import React from 'react';
import flvjs from 'flv.js';
import DPlayer from 'dplayer';
import isEqual from 'lodash/isEqual';
import styles from './index.less'

class Player extends React.Component {
    componentDidMount() {
        this.startPlay();
    }

    componentDidUpdate(preProps) {
        const { video: { url } } = this.props;
        if (!isEqual(url, preProps.video.url)) {
            this.startPlay();
        }
    }

    componentWillUnmount() {
        if(this.dp) {
            this.dp.pause()
        }
    }

    static defaultProps = {
        id: 'd-player',
    };

    startPlay = () => {
        const { id, style, video, ...rest } = this.props;
        if (!video.url) {
            return
        }
        if (this.dp) {
            this.dp.destroy()
        }
        this.dp = new DPlayer({
            container: document.getElementById(id),
            autoplay: true,
            screenshot: true,
            video: {
                url: video.url,
                type: 'customFlv',
                customType: {
                    customFlv: function(V, player) {
                        const flvPlayer = flvjs.createPlayer({
                            type: 'flv',
                            url: V.src,
                        });
                        flvPlayer.attachMediaElement(V);
                        flvPlayer.load();
                    },
                },
                ...video,
            },
            pluginOptions: {
                flv: {
                    mediaDataSource: {},
                    config: {},
                },
            },
            ...rest,
        });
    };

    render() {
        const { style, id } = this.props;
        return (
            <div id={id} style={style} className={styles.player}>
                <div className={styles.error}>
                    <span>播放失败</span>
                </div>
            </div>
        );
    }
}

export default Player;
