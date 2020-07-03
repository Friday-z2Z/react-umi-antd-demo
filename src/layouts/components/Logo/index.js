import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { sysName } from '@/config/platform.config';
import styles from '../../platform/index.less';
import logo from '../../../assets/common/img/logo.png';

class Index extends PureComponent {
    render() {
        const { collapsed } = this.props;
        const imgLogo = <img src={logo} alt="pro" style={{ height: '44px', margin: 'auto', display: 'inherit', padding: '5px 0' }} />;
        let logoPage;
        if (collapsed) {
            logoPage = imgLogo;
        } else {
            logoPage = (
                <Row>
                    <Col span={7}>
                        {imgLogo}
                    </Col>
                    <Col span={17} >
                        <h2 className={styles.animation} style={{ height: '44px', lineHeight: '44px', fontSize: '20px', color: '#efefef', margin: '0' }}>
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
