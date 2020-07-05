import React, { Fragment } from 'react'
import isEqual from 'lodash/isEqual';
import Breadcrumb from '@/components/Breadcrumb';
// import styles from './index.less'

class GlobalPageHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbData: []
        }
    }

    componentDidUpdate(preProps){
        const { location, flattenMenuData } = this.props;
        if (!location || !preProps.location) {
            return;
        }
        const prePathname = preProps.location.pathname;
        // 路由跳转时更新面包屑
        if (prePathname !== location.pathname || !isEqual(flattenMenuData, preProps.flattenMenuData)) {
            this.getBreadcrumbList();
        }
    }

    componentDidMount(){
        this.getBreadcrumbList()
    }

    getBreadcrumbList = () =>{
        const { location: { pathname }, flattenMenuData } = this.props
        // 筛选有路由中的匹配项
        const [menu = {}] = flattenMenuData.filter(item => item.link === pathname);
        const { pathtitles = [] } = menu;
        const breadcrumbData = pathtitles;
        this.setState({
            breadcrumbData: [...breadcrumbData]
        });
    }

    render() {
        const { breadcrumbData }  =this.state;
        const { children } = this.props;
        return (
            <Fragment>
                {/* PageHeader */}
                { children }
                {/* 面包屑 */}
                <Breadcrumb breadcrumbList={breadcrumbData} />
            </Fragment>
        );
    }
}

export default GlobalPageHeader;