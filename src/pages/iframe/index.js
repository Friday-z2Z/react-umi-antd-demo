import pathToRegexp from 'path-to-regexp';

export default function Iframe(props) {
    const { key, menuId } = props.location.state;
    return <iframe title={menuId} src={key} width="100%" height="100%"></iframe>;
}
