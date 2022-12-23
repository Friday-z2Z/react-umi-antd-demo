export default function Iframe(props) {
    const { key, menuId } = props.location.state;
    console.log('---', props, key)
    return <iframe title={menuId} src={key} width="100%" height="100%"></iframe>;
}
