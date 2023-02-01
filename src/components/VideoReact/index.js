import React, { Component } from 'react';
import { Alert } from 'antd'
import { Player, BigPlayButton } from 'video-react';
import 'video-react/dist/video-react.css';
import styles from './index.less'

export default class PlayerControlExample extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {};
    }
    componentDidMount() {
        // subscribe state change
        this.player.subscribeToStateChange(this.handleStateChange.bind(this));
    }

    setMuted(muted) {
        return () => {
            this.player.muted = muted;
        };
    }

    handleStateChange(state) {
        // copy player state to this component's state
        this.setState({
            player: state,
        });
    }

    changeVolume(steps) {
        return () => {
            const { player } = this.player.getState();
            this.player.volume = player.volume + steps;
        };
    }

    render() {
        const { player = {} } = this.state
        return (
            <>
                <Player
                    ref={player => {
                        this.player = player;
                    }}
                    muted
                    autoPlay
                    loop
                    {...this.props}
                >
                    {
                        player.error && (
                            <Alert
                                message="视频加载失败无法播放"
                                type="warning"
                                showIcon
                                afterClose={this.handleClose}
                                className={styles.alert}
                            />
                        )
                    }
                    <BigPlayButton position="center" />
                </Player>
            </>
        );
    }
}
