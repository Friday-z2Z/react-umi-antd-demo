/**
 * title: pageC
 */
import React, { Suspense } from 'react'
const LazyComponent = React.lazy(()=>import('./lazyComponent'))

class pageC extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        // fallback 显示组件渲染出来前的提示信息 组件一次加载内容过大时使用
        return (
            <>
                <Suspense fallback={<div>正在努力加载...</div>}>
                    <LazyComponent></LazyComponent>
                </Suspense>
            </>
        );
    }
}

export default pageC;