import { request } from '@/utils';

export function login(payload) {
    return request('/v1/sys/login', {
        method: 'POST',
        data: JSON.stringify({
            ...payload,
        }),
    });
}

export function logout(payload) {
    return request('/v1/sys/logout', {
        method: 'POST',
        data: JSON.stringify({
            ...payload,
        }),
    });
}

export function getUserInfo(payload) {
    return request('/sys/user/info/', {
        method: 'get',
        params: payload
    });
}