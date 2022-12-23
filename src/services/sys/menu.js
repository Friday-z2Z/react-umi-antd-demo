import { request } from '@/utils';

// 列表
export function getList() {
    return request('/sys/menu/list', {
        method: 'get'
    });
}

// 新增修改菜单list
export function getSelectTree() {
    return request('/sys/menu/select', {
        method: 'get'
    });
}

// 更新菜单
export function menuUpdate(data) {
    return request(`/sys/menu/${data.menuId === 0 ? 'save' : 'update'}`, {
        method: 'post',
        data
    });
}