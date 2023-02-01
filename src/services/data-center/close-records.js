import { request } from '@/utils';

// 列表
export function getList(payload) {
    return request('/v1/datas/page', {
        method: 'post',
        data: payload,
    });
}

// 导出
export function eventExport(payload) {
    return request({
        url: '/v1/datas/event/export',
        method: 'post',
        data: payload,
        responseType: 'blob',
    });
}

// 详情
export function getDetail(payload) {
    return request({
        url: '/v1/datas/detail',
        method: 'post',
        data: payload,
    });
}