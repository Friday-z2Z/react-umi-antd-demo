import { request } from '@/utils';

// 列表
export function getList(payload) {
    return request('/basetoll/list', {
        method: 'post',
        data: payload,
    });
}

// 修改
export function update(payload) {
    return request('/basetoll/update', {
        method: 'post',
        data: payload,
    });
}

// 新增
export function save(payload) {
    return request('/basetoll/save', {
        method: 'post',
        data: payload,
    });
}

// 详情
export function getDetail(payload) {
    return request('/tollsign/sign/' + payload, {
        method: 'get',
    });
}

// 对接参数导出
export function tollSignExport(tollId) {
    return request({
        url: `/tollsign/sign/signExport/${tollId}`,
        method: 'get',
        responseType: 'blob',
    });
}

// 重置密钥
export function tollSignReset(tollId) {
    return request({
        url: `/tollsign/reset/${tollId}`,
        method: 'get',
    });
}
