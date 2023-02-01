import ReactPlayer from 'react-player'

export default function(props) {
    return (
        <ReactPlayer 
            playing={true} 
            loop={true}
            controls={true}
            muted={true}
            pip={true}
            {...props}
        />
    )
}