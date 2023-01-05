import { request } from '@/utils';

// 列表
export function getList(params) {
    return request('/sys/role/list', {
        method: 'get',
		params
    });
}

// 菜单
export function getMenuList() {
    return request('/sys/menu/list', {
        method: 'get'
    });
}

// 获取选中的ids
export function getCheckedIds(params) {
    return request(`/sys/role/info/${params}`, {
        method: 'get',
        params
    });
}

// 新增修改
export function update(data) {
    return request(`/sys/role/${data.roleId ? 'update' : 'save'}`, {
        method: 'post',
		data
    });
}

// 删除
export function del(data) {
    return request('/sys/role/delete', {
        method: 'post',
		data
    });
}