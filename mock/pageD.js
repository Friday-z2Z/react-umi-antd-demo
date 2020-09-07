const Mock = require('mockjs');

const { Random } = Mock

module.exports = {
    [`GET /api/getPageDData`](req, res) {
        res.status(200).json({
            ...Mock.mock({
                'code':0,
                'data|30': [{
                    'key|+1': 1,
                    'name': Random.cname(),
                    'age|18-25': 22,
                    'address': Random.city(),
                    'desc|20-30':Random.title()
                }]
            })
        });
    },
};
