import { resolve } from "path";
import _default from './src/theme.config/default'; // 不是颜色主题
// import * as theme from './src/theme.config/default-theme'; // 默认
// import * as theme from './src/theme.config/tiffany'; // 蒂芙尼主题
// import * as theme from './src/theme.config/dark-night-red'; // 暗夜红主题
import * as theme from './src/theme.config/young'; // 黄绿青春主题

export default {
    base: '/',
    treeShaking: true, //用于描述移除 JavaScript 上下文中的未引用代码
    // history: 'hash', //hash路由
    // hash: true,//生成hash文件名
    // base:'./',
    publicPath: './',
    // disableRedirectHoist: true, //禁用 redirect 上提。
    // devtool: 'source-map',//生成map文件
    targets: {
        //兼容浏览器版本
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
    //         component: '@/layouts/index',
    //         routes: [
    //             { path: '/', component: '../pages/sys/index' },
    //         ]
    //     }
    // ],
    plugins: [
        [
            'umi-plugin-react',
            {
                antd: true,
                dva: true,
                dynamicImport: {
                    webpackChunkName: true,
                    loadingComponent: './components/PageLoading/index.js',
                },
                title: '收费站拥堵智能监测系统',
                dll: true,
                locale: {
                    enable: true,
                    default: 'zh-CN', //'en-US',
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
            },
        ],
    ],
    theme: { ..._default, ...theme },
    // alias: {
    //     "@": resolve(__dirname, "../src"),
    // },
    proxy: {
        // '/api': {
        //     target: 'http://10.85.94.238:10660',
        //     changeOrigin: true,
        //     pathRewrite: { '^/api': '/' },
        // },
        '/api': {
            target: 'http://192.168.2.24:9105',
            // target: 'http://192.168.1.77:9100',
            // target: 'http://192.168.1.26:59105',
            changeOrigin: true,
            pathRewrite: { '^/api': '/api' },
        }
    },
};
