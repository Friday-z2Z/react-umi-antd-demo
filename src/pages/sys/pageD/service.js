import { request } from '@/utils';

export function getPageDData(payload) {
    return request('/getPageDData', {
        method: 'GET',
        params: {
            ...payload,
        },
    });
}