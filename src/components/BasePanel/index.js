
import styles from './index.less'

export default function Panel(props) {
	const { children } = props
	return (
		<div className={styles.panel}>
			{ children }
		</div>
	)
};