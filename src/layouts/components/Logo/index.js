import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames'
import { Row, Col } from 'antd';
import { sysName } from '@/config/platform.config';
import styles from './index.less';
import logo from '../../../assets/common/img/logo.png';

class Index extends PureComponent {
    render() {
        const { collapsed } = this.props;
        const imgLogo = <img src={logo} alt="pro" className={styles.sysImgLogo} />;
        let logoPage;
        if (collapsed) {
            logoPage = imgLogo;
        } else {
            logoPage = (
                <Row>
                    <Col span={24} >
                        <h2 className={classnames(styles.animation,styles.sysTitle)}>
                            {sysName}
                        </h2>
                    </Col>
                </Row>
            );
        }
        return <div className={styles.logoPage}>
            {logoPage}
        </div>
    }
}

Index.propTypes = {
    collapsed: PropTypes.bool
};

export default Index;
