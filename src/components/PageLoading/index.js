import React from 'react';

import { Spin } from 'antd';
import styles from './index.less';

export default () => (
    <div className={styles.loader}  >
        <Spin size="large" />
    </div>
);