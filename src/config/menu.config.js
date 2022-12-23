export default [
    {
        title: "主页",
        link: "/home",
        key: "home",
        icon: "shouye"
    },
    {
        title: '其他页面',
        key: 'pages',
        icon: 'daohang',
        children: [
            {
                title: '页面A',
                link: '/sys/pageA',
                key: 'pageA',
                icon: 'bianji',
            },
        ],
    },
    {
        title: '页面B',
        link: '/sys/pageB',
        key: 'pageB',
        icon: 'editor',
    },
    {
        title: '页面C',
        link: '/sys/pageC',
        key: 'pageC',
        icon: 'system',
    },
    {
        title: '页面D',
        link: '/sys/pageD',
        key: 'pageD',
        icon: 'admin',
    },
    {
        title: "系统管理",
        key: "system",
        icon: 'system',
        children: [
            {
                title: '菜单管理',
                link: '/sys/menu',
                key: 'menu',
                parentKey: 'system'
            },
        ],
    }
];
