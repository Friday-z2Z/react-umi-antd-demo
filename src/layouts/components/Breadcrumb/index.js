import { PureComponent } from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'umi';
import isEqual from 'lodash/isEqual';
import { Icon } from '@/components';
import styles from './index.less';

class BreadcrumbView extends PureComponent {
    state = {
        breadcrumbItems: null,
    };
    static defaultProps = {
        breadcrumbList: [],
        breadcrumbSeparator: '/'
    };
    componentDidMount() {
        this.getBreadcrumbDom();
    }
    componentDidUpdate(preProps) {
        const { breadcrumbList } = this.props;
        if (!isEqual(breadcrumbList, preProps.breadcrumbList)) {
            this.getBreadcrumbDom();
        }
    }
    getBreadcrumbDom = () => {
        const breadcrumbItems = this.itemRender();
        this.setState({
            breadcrumbItems,
        });
    }
    itemRender = () => {
        const { breadcrumbList } = this.props;
        // 根据len判断item是否加链接
        const len = breadcrumbList.length - 1;
        return breadcrumbList.map((item, i) => {
            const { title, icon, link, query, state } = typeof item === 'object' ? item : {};
            return (
                <Breadcrumb.Item key={`breadcrumb_${i}`}>
                    {icon && <Icon type={icon} />}
                    {link && i !== len ? <Link to={{ pathname: link, query, state }}>{title}</Link> : <span>{title}</span>}
                </Breadcrumb.Item>
            );
        });
    }
    render() {
        const { breadcrumbSeparator } = this.props;
        const { breadcrumbItems } = this.state;
        return (
            <Breadcrumb className={styles.breadcrumb} separator={breadcrumbSeparator}>
                {breadcrumbItems}
            </Breadcrumb>
        );
    }
}

export default BreadcrumbView;