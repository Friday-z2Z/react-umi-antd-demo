import { request } from '@/utils';

// 列表
export function getList(payload) {
    return request('/camera/list', {
        method: 'post',
        data: payload,
    });
}

// 导出
export function cameraExport(data) {
    return request({
        url: '/camera/list/export',
        method: 'post',
        data,
        responseType: 'blob',
    });
}

