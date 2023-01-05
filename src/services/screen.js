import { request } from '@/utils';

export function getAlarm(payload) {
    return request('/v1/desk/alarm', {
        method: 'post',
        data: payload,
    });
}

// 获取车流量折线图
export function getTrafficFlowStatistical(payload) {
    return request('/v1/desk/getTrafficFlowStatistical', {
        method: 'get',
        params: payload,
    });
}

// 获取车流量折线图
export function getTrafficRank(payload) {
    return request('/v1/desk/getTrafficRank', {
        method: 'get',
        params: payload,
    });
}