import { request } from '@/utils';

// 收费站下拉
export function getStation(payload) {
    return request('/common/toll/down', {
        method: 'post',
        data: payload,
    });
}

// 城市下拉
export function getCity(payload) {
    return request('/common/city/down', {
        method: 'get',
        params: payload,
    });
}

// 道路下拉
export function getRoad(payload) {
    return request('/common/road/down', {
        method: 'get',
        params: payload,
    });
}

// 排队下拉
export function getQueue(payload) {
    return request('/common/queue/down', {
        method: 'get',
        params: payload,
    });
}

// 排队下拉
export function getQueue2(payload) {
    return request('/common/queue/down1', {
        method: 'get',
        params: payload,
    });
}

// 事件类型
export function getQueueEvent(payload) {
    return request('/common/queue/event/down', {
        method: 'get',
        params: payload,
    });
}

// 场景下拉
export function getScene(payload) {
    return request('/common/scene/down', {
        method: 'get',
        params: payload,
    });
}

// 事件类型下拉
export function getEvent(payload) {
    return request('/common/event/down', {
        method: 'get',
        params: payload,
    });
}

// 获取flvVideo
export function getFlvUrl(payload) {
    return request({
        url: '/common/getFlvUrl',
        method: 'get',
        params: payload,
    });
}

// 获取video
export function getVideoUrl(payload) {
    return request({
        url: payload,
        method: 'get',
    });
}

// 修改密码
export function changePassword(data) {
    return request({
        url: '/sys/user/password',
        method: 'post',
        data,
    });
}
