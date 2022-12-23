import { request } from '@/utils';

// 列表
export function getList(params) {
    return request('/sys/schedule/list', {
        method: 'get',
		params
    });
}

// 新增修改
export function update(data) {
    return request(`/sys/schedule/${data.jobId ? 'update' : 'save'}`, {
        method: 'post',
		data
    });
}

// 删除
export function del(data) {
    return request('/sys/schedule/delete', {
        method: 'post',
		data
    });
}

// 暂停
export function pause(data) {
    return request('/sys/schedule/pause', {
        method: 'post',
		data
    });
}

// 恢复
export function resume(data) {
    return request('/sys/schedule/resume', {
        method: 'post',
		data
    });
}

// 执行
export function run(data) {
    return request('/sys/schedule/run', {
        method: 'post',
		data
    });
}

// 日志列表查询
export function getLogList(params) {
    return request('/sys/scheduleLog/list', {
        method: 'get',
		params
    });
}

// 日志错误信息
export function getErrorInfo(logId) {
    return request('/sys/scheduleLog/info/' + logId, {
        method: 'get'
    });
}