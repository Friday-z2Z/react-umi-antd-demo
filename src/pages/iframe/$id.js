import { Exception } from '@/components';
import pathToRegexp from 'path-to-regexp';

export default function Iframe(props) {
    const { location:{ state = {}, pathname } } = props
    const { key = '', menuId = '' } = state;
    const [, id] = pathToRegexp('/iframe/:id').exec(pathname);
    if (menuId.toString() === id) {
        return <iframe title={menuId} src={key} width="100%" height="100%" style={{border: 'none' }}></iframe>;
    } else {
        return <Exception />
    }
}