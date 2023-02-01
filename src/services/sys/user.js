import { request } from '@/utils';

// 列表
export function getList(params) {
    return request('/sys/user/list', {
        method: 'get',
        params,
    });
}

// 管理员添加提交
export function userAdd(data) {
    return request({
        url: `/sys/user/${!data.userId ? 'save' : 'update'}`,
        method: 'post',
        data,
    });
}

//角色选择
export function roleSelectList() {
    return request({
        url: '/sys/role/select',
        method: 'get',
    });
}

//管理员信息
export function getDetail(id) {
    return request({
        url: `/sys/user/info/${id}`,
        method: 'get',
    });
}

// 删除
export function del(data) {
    return request({
        url: '/sys/user/delete',
        method: 'post',
        data,
    });
}
