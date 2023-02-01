import React from 'react';

import { Spin } from 'antd';
import styles from './index.less';

export default (props) => (
    <div className={styles.loader} style={props.style}>
        <Spin size="large" />
    </div>
);