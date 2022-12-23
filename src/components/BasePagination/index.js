import { Pagination } from 'antd';
import styles from './index.less'

export default function(props){
	return (
		<Pagination 
			showQuickJumper 
			defaultCurrent={1}
			showSizeChanger
			showTotal={(total, range) => `${range[0]}-${range[1]} 总条数: ${total}`}
			{...props} 
			className={styles.pagination}
		/>
	)
};