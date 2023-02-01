import { request } from '@/utils';

// 列表
export function getList(payload) {
    return request('/basetoll/toll/baseinfo/list', {
        method: 'post',
        data: payload,
    });
}

// 导出
export function customizeExport(payload) {
    return request({
        url: '/basetoll/toll/baseinfo/list/customizeExport',
        method: 'post',
        data: payload,
        responseType: 'blob',
    });
}

// 基础信息详情
export function getDetail(tollId) {
    return request({
        url: `/basetoll/toll/baseinfo/${tollId}`,
        method: 'get',
    });
}
