import { request } from '@/utils';

// 列表
export function getList(payload) {
    return request('/v1/datas/states', {
        method: 'post',
		data: payload
    });
}

// 导出
export function stationExport(payload) {
    return request({
        url: '/v1/datas/tollStatisticsExcelDown',
        method: 'post',
        data: payload,
        responseType: 'blob',
    });
}