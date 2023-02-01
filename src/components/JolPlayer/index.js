import React from 'react';
import Player from "jol-player";

class JolPlayer extends React.Component {
    render() {
        return (
            <Player 
                option={{ ...this.props }}
            />
        )
    }
}

export default JolPlayer;