import React, { PureComponent } from 'react';
import { Link } from 'umi';
import PropTypes from 'prop-types';

import { Result, Button } from 'antd';
import config from './typeConfig';

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
            redirect
        } = this.props;
        const pageType = type in config ? type : '404';
        const pageTitle = title in config ? type : '404';
        return (
            <Result
                status={pageType}
                title={pageTitle}
                subTitle={desc || config[pageType].desc}
                extra={<Link to={redirect}>
                    <Button type="primary">{backText}</Button>
                </Link>}
            />
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
};