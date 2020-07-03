const Page_403 = require('@/assets/error/img/403.svg')
const Page_404 = require('@/assets/error/img/404.svg')
const Page_500 = require('@/assets/error/img/500.svg')

const config = {
    403: {
        img: Page_403,
        title: '403',
        desc: '抱歉，你无权访问该页面',
    },
    404: {
        img: Page_404,
        title: '404',
        desc: '抱歉，你访问的页面不存在',
    },
    500: {
        img: Page_500,
        title: '500',
        desc: '抱歉，服务器出错了',
    }
}

export default config;