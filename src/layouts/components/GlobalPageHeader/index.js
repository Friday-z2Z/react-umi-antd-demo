import React, { Fragment } from 'react'
import CacheTabs from '../CacheTabs'

class GlobalPageHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbData: []
        }
    }

    render() {
        const { children } = this.props;
        return (
            <Fragment>
                { children }
                {/* 缓存tab */}
                <CacheTabs {...this.props}/>
            </Fragment>
        );
    }
}

export default GlobalPageHeader;