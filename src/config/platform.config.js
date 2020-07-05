module.exports = {
    // 数据请求api
    apiPrefix: document.head.dataset.api || '',
    sysLogo: 'logo.png',
    // 登录页名称
    loginName: 'React-demo',
    // 系统名称
    sysName: 'react-demo',
    // 是否开启菜单权限校验 trur原始菜单与返回菜单比对形成权限菜单 false原始菜单
    menuPermission: false,
    // table默认一页条数
    pageSize: 10,
    // iconFont 地址
    iconUrl: '//at.alicdn.com/t/font_1030595_depmdbpf3yc.js',
    // 系统默认首页
    sysDefultPage: {
        pathname: '/sys/pageA',
        state: {
            key: 'pageA',
            pathtitles: [{ title: 'pageA', icon: 'font-colors' }],
        }
    },
};