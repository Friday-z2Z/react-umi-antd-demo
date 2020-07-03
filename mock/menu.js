const Mock = require('mockjs');
const menuData = [
    {
        title: "pages",
        key: "pages",
        children: [
            {
                title: "pageA",
                key: "pageA",
            }
        ]
    },
    {
        title: "pageB",
        key: "pageB",
    }
];
const data = Mock.mock({
    data: menuData,
    status: 0
});
module.exports = {
    [`POST /api/getMenuData`](req, res) {
        res.status(200).json(data);
    },
};