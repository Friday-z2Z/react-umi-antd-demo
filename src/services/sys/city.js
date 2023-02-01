import { request } from '@/utils';

// 列表
export function getList(payload) {
    return request('/basecity/list', {
        method: 'post',
		data: payload
    });
}

// 修改
export function update(payload) {
    return request('/basecity/update', {
        method: 'post',
		data: payload
    });
}

// 新增
export function save(payload) {
    return request('/basecity/save', {
        method: 'post',
		data: payload
    });
}

// 删除
export function del(payload) {
    return request('/basecity/delete/' + payload, {
        method: 'get',
    });
}