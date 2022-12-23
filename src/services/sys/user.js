import { request } from '@/utils';

// 列表
export function getList(params) {
    return request('/sys/user/list', {
        method: 'get',
		params
    });
}