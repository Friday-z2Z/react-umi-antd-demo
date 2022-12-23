module.exports = {
    // 数据请求api
    apiPrefix: document.head.dataset.api || '',
    sysLogo: 'logo.png',
    // 登录页名称
    loginName: 'React-demo',
    // 系统名称
    sysName: '收费站拥堵智能监测系统',
    // 是否开启菜单权限校验 trur原始菜单与返回菜单比对形成权限菜单 false原始菜单
    menuPermission: true,
    defaultLoginName:'admin',
    defaultLoginPsw:'123456',
    pageNum: 1,
    // table默认一页条数
    pageSize: 10,
    // iconFont 地址
    iconUrl: '//at.alicdn.com/t/c/font_3297923_4vv9c1v6s7n.js',
    // 系统默认首页
    sysDefultPage: {
        pathname: '/home',
        name: '主页',
        menuId: 999,
        icon: "shouye",
        url: '/home',
        state: {
            key: '/home',
            pathtitles: ['主页'],
        }
    },
};