var async = require('async');
var utils = require('./util/asyncHelper');

// //并行运行任务，最后将所有的结果一起回调
// async.parallel([
//     async.apply(utils.inc, 3),
//     async.apply(utils.fire, 10)
// ], function(err, data) {
//    utils.log('[test apply] err: ', err);
//    utils.log('[test apply] data: ', data); 
// });

// function add (a, b, callback, timeout) {
//     timeout = timeout || 200;
//     utils.wait(timeout);
//     callback(null, a+b);
// }
// var fn = async.apply(add, 1, 2);
// fn(function(err, data) {
//     utils.log('[test apply2] err: ', err); 
//     utils.log('[test apply2] data: ', data); 
// });

// /**
//  * 并行，可以实现给一数组中每个函数传相同参数，通过callback返回
//  */
// async.applyEach([
//     function(a, callback) {
//         setTimeout(function() {
//             utils.log('[test applyEach_infn] data: ', a*2);
//             callback(null, a*2);
//         }, 500);
//     }, function(a, callback) {
//         setTimeout(function() {
//             utils.log('[test applyEach_infn] data: ', a);
//             callback(null, a);
//         }, 500);
//     }
// ], 10, function(err, data) {
//     utils.log('[test applyEach] err: ', err); 
//     utils.log('[test applyEach] data: ', data); 
// });

// /**
//  * 串行，applyEachSeries与applyEach唯一不同的是，数组的函数同步执行
//  */
// async.applyEachSeries([
//     function(a, callback) {
//         setTimeout(function() {
//             utils.log('[test applyEachSeries_infn] data: ', a*2); 
//             callback(null, a*2);
//         }, 500);
//     }, function(a, callback) {
//         setTimeout(function() {
//             utils.log('[test applyEachSeries_infn] data: ', a);
//             callback(null, a);
//         }, 500);
//     }
// ], 20, function(err, data) {
//     utils.log('[test applyEachSeries] err: ', err); 
//     utils.log('[test applyEachSeries] data: ', data); 
// });

// /**
//  * auto用来处理有依赖关系的多个任务的执行
//  */
// /**
//  * 我要写一个程序，它要完成以下几件事：
//  * 1. 从某处取得数据
//  * 2. 在硬盘上建立一个新的目录
//  * 3. 将数据写入到目录下某文件
//  * 4. 发送邮件，将文件以附件形式发送给其它人。
//  *
//  * 分析该任务，可以知道1与2可以并行执行，3需要等1和2完成，4要等3完成。
//  * 可以按以下方式来使用auto函数。
//  */
// async.auto({
//     getData: function(callback) {
//         setTimeout(function() {
//             console.log('got data');
//             callback(null, 'mydata');
//         }, 200);
//     },
//     makeFolder: function(callback) {
//         setTimeout(function() {
//             console.log('made folder');
//             callback(null, 'myFolder'); 
//         }, 200);
//     },
//     writeFile: ['getData', 'makeFolder', function(result, callback) {
//         setTimeout(function() {
//             console.log('write file');
//             callback(null, 'myfile'); 
//         }, 200);
//     }],
//     emailFiles: ['writeFile', function(result, callback) {
//         setTimeout(function() {
//             console.log(result.writeFile);
//             callback(null, result.writeFile)
//         }, 200);
//     }]
// }, function(err, data) {
//     utils.log('[test auto] err: ', err); 
//     utils.log('[test auto] data: ', data); 
// });

/**
 * cargo也是一个串行的消息队列，类似于queue，通过限制了worker数量，不再一次性全部执行。
 * 当worker数量不够用时，新加入的任务将会排队等候，直到有新的worker可用。
 *
 * cargo的不同之处在于，cargo每次会加载满额的任务做为任务单元，只有任务单元中全部执行完成后，才会加载新的任务单元。
 */
/**
 * 创建cargo实例
 */
var cargo = async.cargo(function(tasks, callback) {
    tasks.forEach(function(task) { 
        utils.log('', 'start' + task.name);
    });
    callback();
}, 2);

/**
 * 监听：如果某次push操作后，任务数将达到或超过worker数量时，将调用该函数
 */
cargo.saturated = function() {
   utils.log('', 'all worker to be used');
}

/**
 * 监听：当最后一个任务交给worker时，将调用该函数
 */
cargo.empty = function() {
    utils.log('', 'no more tasks waiting');
}

/**
 * 监听：当所有任务都执行完以后，将调用该函数
 */
cargo.drain = function() {
    utils.log('', 'all tasks have been processed');
}

/**
 * 增加新任务
 */
cargo.push({name: 'A'}, function(err) {
   utils.wait(500);
   utils.log('', 'finished processe A'); 
});
cargo.push({name: 'B'}, function(err) {
   utils.wait(100);
   utils.log('', 'finished processe B'); 
});
cargo.push({name: 'C'}, function(err) {
   utils.wait(200);
   utils.log('', 'finished processe C'); 
});
cargo.push({name: 'D'}, function(err) {
   utils.wait(200);
   utils.log('', 'finished processe D'); 
});