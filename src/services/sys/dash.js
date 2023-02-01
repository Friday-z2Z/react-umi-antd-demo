import { request } from '@/utils';

// 列表
export function getList(payload) {
    return request('/baseroad/list', {
        method: 'post',
        data: payload,
    });
}

// 详情
export function getDetail(id) {
    return request({
        url: `/baseroad/info/${id}`,
        method: 'get',
    });
}

// 修改
export function update(payload) {
    return request('/baseroad/update', {
        method: 'post',
        data: payload,
    });
}

// 新增
export function save(payload) {
    return request('/baseroad/save', {
        method: 'post',
        data: payload,
    });
}

// 删除
export function del(payload) {
    return request('/baseroad/delete/' + payload, {
        method: 'get',
    });
}
