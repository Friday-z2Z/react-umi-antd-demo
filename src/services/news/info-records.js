import { request } from '@/utils';

// 列表
export function getList(payload) {
    return request('/eventrecord/list', {
        method: 'post',
        data: payload,
    });
}

// 导出
export function eventExport(payload) {
    return request({
        url: '/eventrecord/list/export',
        method: 'post',
        data: payload,
        responseType: 'blob',
    });
}