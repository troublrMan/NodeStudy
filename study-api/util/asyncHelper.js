var moment = require('moment');

/**
 * 测试async自备工具(提供一些异步方法)
 * learn form https://github.com/alsotang/async_demo/blob/master/t.js
 */
function Utils() {
    
}

/**
 * 等待timeout毫秒，回调一个n+1的值
 */
Utils.prototype.inc = function(n, callback, timeout) {
    timeout = timeout || 200;
    setTimeout(function() {
        //一般回调结果的格式 callback(err, data)
        callback(null, n+1);
    }, timeout);
};

/**
 * 等待timeout毫秒，直接回调obj
 */
Utils.prototype.fire = function(obj, callback, timeout) {
    timeout = timeout || 200;
    setTimeout(function() {
        callback(null, obj);
    }, timeout);
};

/**
 * 等待timeout毫秒，回调错误信息
 */
Utils.prototype.err = function(errMsg, callback, timeout) {
    timeout = timeout || 200;
    setTimeout(function() {
        callback(errMsg);
    }, timeout);
};

/**
 * 对console.log进行了封装。主要是增加了秒钟的输出，通过秒数的差值方便大家对async的理解
 */
Utils.prototype.log = function(msg, obj) {
    process.stdout.write(moment().format('ss.SSS') + '> ');
    if(obj !== undefined) {
        process.stdout.write(msg);
        console.log(obj);
    }
};

/**
 * 刻意等待mils毫秒
 */
Utils.prototype.wait = function(mils) {
    var now = new Date;
    while(new Date - now <= mils);
}

var utils = new Utils();
module.exports = utils;