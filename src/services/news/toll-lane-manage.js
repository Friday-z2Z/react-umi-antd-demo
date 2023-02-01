import { request } from '@/utils';

// 列表
export function getList(payload) {
    return request('/vehiclelanemanagement/list', {
        method: 'post',
        data: payload,
    });
}