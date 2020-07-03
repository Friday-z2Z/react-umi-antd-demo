import React, { PureComponent } from 'react';
import { Link } from 'umi';
import PropTypes from 'prop-types';

import { Button } from 'antd';
import config from './typeConfig';
import styles from './index.less';

export default class Exception extends PureComponent {
    static defaultProps = {
        backText: '返回首页',
        redirect: {
            pathname: '/sys'
        },
    };

    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const {
            backText,
            type,
            title,
            desc,
            redirect,
            img
        } = this.props;
        const pageType = type in config ? type : '404';
        const pageTitle = title in config ? type : '404';
        return (
            <div className={styles.exception}>
                <div className={styles.imgBlock}>
                    <div
                        className={styles.imgEle}
                        style={{ backgroundImage: `url(${img || config[pageType].img})` }}
                    />
                </div>
                <div className={styles.content}>
                    <h1>{pageTitle || config[pageType].title}</h1>
                    <div className={styles.desc}>{desc || config[pageType].desc}</div>
                    <div className={styles.actions}>
                        <Link to={redirect}>
                            <Button type="primary">{backText}</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}
Exception.propTypes = {
    backText: PropTypes.string,
    type: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    title: PropTypes.string,
    desc: PropTypes.string,
    redirect: PropTypes.object,
    img: PropTypes.string
};