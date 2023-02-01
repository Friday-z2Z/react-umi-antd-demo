import { request } from '@/utils';

// 列表
export function getList(payload) {
    return request('/v1/datas/queue/list', {
        method: 'post',
		data: payload
    });
}

// 导出
export function queueExport(payload) {
    return request({
        url: '/v1/datas/queue/export',
        method: 'post',
        data: payload,
        responseType: 'blob',
    });
}

// 详情
export function getDetail(payload) {
    return request('/v1/desk/event/detail', {
        method: 'post',
		data: payload
    });
}