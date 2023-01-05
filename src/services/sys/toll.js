import { request } from '@/utils';

// 列表
export function getList(payload) {
    return request('/basetoll/list', {
        method: 'post',
		data: payload
    });
}

// 收费站下拉
export function getStationOption(payload) {
    return request('/common/toll/down', {
        method: 'post',
		data: payload
    });
}

// 城市下拉
export function getCity(payload) {
    return request('/common/city/down', {
        method: 'get',
		params: payload
    });
}

// 道路下拉
export function getRoad(payload) {
    return request('/common/road/down', {
        method: 'get',
		params: payload
    });
}

// 修改
export function update(payload) {
    return request('/basetoll/update', {
        method: 'post',
		data: payload
    });
}

// 新增
export function save(payload) {
    return request('/basetoll/save', {
        method: 'post',
		data: payload
    });
}