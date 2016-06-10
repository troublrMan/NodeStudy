var helper = require('../util/async-helper');

/**
 * 使用callback做异步控制
 */
exports.callbackTest = function(cb) {
    var result = [];
    helper.asyncReturn('hello', function(data) {
        result.push(data);
        helper.asyncReturn('world', function(data) {
            result.push(data);
            helper.asyncReturn('chen', function(data) {
                result.push(data);
                cb(result);
            }, 200);
        }, 100);
    }, 300);
};