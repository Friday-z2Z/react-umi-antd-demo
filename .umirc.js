// import { resolve } from "path";
import theme from "./src/config/theme.config"

export default {
    base: '/',
    treeShaking: true,//用于描述移除 JavaScript 上下文中的未引用代码
    //   history: 'hash',//hash路由
    //   hash: true,//生成hash文件名
    //   disableRedirectHoist: true,//禁用 redirect 上提。
    // devtool: 'source-map',//生成map文件
    targets: {//兼容浏览器版本
        // ie: 11,
    },
    // 配置模块不打入代码
    //   externals: {
    //     // echarts: 'window.echarts',
    //     d3: 'window.d3',
    //   },
    // 打开routes即为配置式路由
    // routes: [
    //     {
    //         path: '/',
    //         component: '../layouts/index',
    //         routes: [
    //             { path: '/', component: '../pages/index' }
    //         ]
    //     }
    // ],
    plugins: [
        // ref: https://umijs.org/plugin/umi-plugin-react.html
        ['umi-plugin-react', {
            antd: true,
            dva: true,
            dynamicImport: {
                webpackChunkName: true,
                loadingComponent: './components/PageLoading/index.js'
            },
            title: 'demo-umi-2X',
            dll: true,
            locale: {
                enable: true,
                default: 'zh-CN',//'en-US',
            },
            routes: {
                exclude: [
                    /models\//,
                    /services\//,
                    /model\.(t|j)sx?$/,
                    /service\.(t|j)sx?$/,
                    /components\//,
                ],
            },
            // cdn
            //   scripts: [
            //     { src: 'https://cdn.bootcss.com/d3/5.9.2/d3.min.js' },
            //   ],
        }],
    ],
    theme,
    //   alias: {
    //     "@": resolve(__dirname, "../src"),
    //     '@utils': resolve(__dirname, "../src/utils"),
    //   },
    proxy: {
        "/api": {
            target: "http://10.85.94.238:10660",
            changeOrigin: true,
            pathRewrite: { "^/api": "/" }
        }
    },
}
