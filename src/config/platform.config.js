module.exports = {
    // 数据请求api
    apiPrefix: document.head.dataset.api || '',
    sysLogo: 'logo.png',
    // 登录页名称
    loginName: 'React-demo',
    // 系统名称
    sysName: '收费站拥堵智能监测系统',
    sysScreenName: '高速公路收费站拥堵智能监测系统',
    // 是否开启菜单权限校验 trur原始菜单与返回菜单比对形成权限菜单 false原始菜单
    menuPermission: true,
    defaultLoginName:'admin',
    defaultLoginPsw:'Admin12345~',
    pageNum: 1,
    // table默认一页条数
    pageSize: 10,
    // iconFont 地址
    iconUrl: '//at.alicdn.com/t/c/font_3297923_a7hfgt70ff8.js',
    // 系统默认首页
    sysDefultPage: {
        pathname: '/screen',
        name: '大屏',
    },
};