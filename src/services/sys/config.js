import { request } from '@/utils';

// 列表
export function getList(params) {
    return request('/sys/config/list', {
        method: 'get',
		params
    });
}

// 新增修改
export function update(data) {
    return request(`/sys/config/${data.id ? 'update' : 'save'}`, {
        method: 'post',
		data
    });
}

// 删除
export function del(data) {
    return request('/sys/config/delete', {
        method: 'post',
		data
    });
}