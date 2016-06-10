/**
 * 一个可以设置等待时间回调data的测试辅助函数
 */
exports.asyncReturn = function (data, callback, timeout) {
    timeout = timeout || 200;
    setTimeout(function() {
        callback(data);
    }, timeout);
};