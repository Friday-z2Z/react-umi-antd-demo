import Cookies from 'js-cookie';

// 给token命名
const TokenKey = 'toll-station-token';
// 给时间戳命名
const timeKey = 'timestamp-key';
// token数据处理
// 获取token
export function getToken() {
    return Cookies.get(TokenKey);
}
// 存token
export function setToken(token) {
    return Cookies.set(TokenKey, token);
}
// 移除token
export function removeToken() {
    return Cookies.remove(TokenKey);
}

// token过期时间处理
// 获取时间戳
export function getTimeStamp() {
    return Cookies.get(timeKey);
}
// 设置时间戳
export function setTimeStamp() {
    Cookies.set(timeKey, Date.now());
}
