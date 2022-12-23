import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Result } from 'antd';
import config from './typeConfig';

export default class Exception extends PureComponent {
    static defaultProps = {
        backText: '返回首页',
    };

    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const {
            type,
            title,
            desc,
        } = this.props;
        const pageType = type in config ? type : '404';
        const pageTitle = title in config ? type : '404';
        return (
            <Result
                status={pageType}
                title={pageTitle}
                subTitle={desc || config[pageType].desc}
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