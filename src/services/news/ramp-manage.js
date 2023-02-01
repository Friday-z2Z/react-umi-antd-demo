import { request } from '@/utils';

// 列表
export function getList(payload) {
    return request('/rampmanagement/list', {
        method: 'post',
        data: payload,
    });
}

// 匝道管理配置接口
export function queueconfigList(payload) {
    return request({
        url: `/queueconfig/info/rampId/${payload}`,
        method: 'get',
    });
}

// 匝道管理配置修改接口
export function queueconfigUpdate(data) {
    return request({
        url: '/queueconfig/infos/update',
        method: 'post',
        data,
    });
}
