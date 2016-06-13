var async = require('async');
var utils = require('./util/asyncHelper');

//并行运行任务，最后将所有的结果一起回调
async.parallel([
    async.apply(utils.inc, 3),
    async.apply(utils.fire, 10)
], function(err, data) {
   utils.log('[test apply] err: ', err);
   utils.log('[test apply] data: ', data); 
});

function add (a, b, callback, timeout) {
    timeout = timeout || 200;
    utils.wait(timeout);
    callback(null, a+b);
}
var fn = async.apply(add, 1, 2);
fn(function(err, data) {
    utils.log('[test apply2] err: ', err); 
    utils.log('[test apply2] data: ', data); 
});

/**
 * 可以实现给一数组中每个函数传相同参数，通过callback返回
 */
async.applyEach([
    function(a, callback) {
        setTimeout(function() {
            utils.log('[test applyEach_infn] data: ', a*2);
            callback(null, a*2);
        }, 500);
    }, function(a, callback) {
        setTimeout(function() {
            utils.log('[test applyEach_infn] data: ', a);
            callback(null, a);
        }, 500);
    }
], 10, function(err, data) {
    utils.log('[test applyEach] err: ', err); 
    utils.log('[test applyEach] data: ', data); 
});

/**
 * applyEachSeries与applyEach唯一不同的是，数组的函数同步执行
 */
async.applyEachSeries([
    function(a, callback) {
        setTimeout(function() {
            utils.log('[test applyEachSeries_infn] data: ', a*2); 
            callback(null, a*2);
        }, 500);
    }, function(a, callback) {
        setTimeout(function() {
            utils.log('[test applyEachSeries_infn] data: ', a);
            callback(null, a);
        }, 500);
    }
], 20, function(err, data) {
    utils.log('[test applyEachSeries] err: ', err); 
    utils.log('[test applyEachSeries] data: ', data); 
});

/**
 * auto用来处理有依赖关系的多个任务的执行
 */
/**
 * 我要写一个程序，它要完成以下几件事：
 * 1. 从某处取得数据
 * 2. 在硬盘上建立一个新的目录
 * 3. 将数据写入到目录下某文件
 * 4. 发送邮件，将文件以附件形式发送给其它人。
 *
 * 分析该任务，可以知道1与2可以并行执行，3需要等1和2完成，4要等3完成。
 * 可以按以下方式来使用auto函数。
 */
async.auto({
    getData: function(callback) {
        setTimeout(function() {
            console.log('got data');
            callback(null, 'mydata');
        }, 200);
    },
    makeFolder: function(callback) {
        setTimeout(function() {
            console.log('made folder');
            callback(null, 'myFolder'); 
        }, 200);
    },
    writeFile: ['getData', 'makeFolder', function(callback) {
        setTimeout(function() {
            console.log('write file');
            callback(null, 'myfile'); 
        }, 200);
    }],
    emailFiles: ['writeFile', function(callback, result) {
        setTimeout(function() {
            console.log(result.writeFile);
            callback(null, result.writeFile)
        }, 200);
    }]
}, function(err, data) {
    utils.log('[test auto] err: ', err); 
    utils.log('[test auto] data: ', data); 
});