import { Icon } from 'antd'
import styles from './index.less'

export default function LazyLoading(){
    return (
        <div className={styles.lazyLoading}>
            <Icon type="loading" theme="twoTone" />
        </div>
    )
}