const Mock = require('mockjs');
const menuData = [
    {
        title: "home",
        key: "home",
        icon: "home-page"
    },
    {
        title: "pages",
        key: "pages",
        icon: 'shezhi',
        children: [
            {
                title: "pageA",
                key: "pageA",
                icon: 'shuju',
            }
        ]
    },
    {
        title: "pageB",
        key: "pageB",
        icon: 'road',
    },
    {
        title: "系统管理",
        key: "shezhi",
        icon: 'shezhi'
    }
];
const data = Mock.mock({
    data: menuData,
    code: 0,
});
module.exports = {
    [`POST /api/getMenuData`](req, res) {
        res.status(200).json(data);
    },
};