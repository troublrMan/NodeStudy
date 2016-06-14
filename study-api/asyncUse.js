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
 * 并行，可以实现给一数组中每个函数传相同参数，通过callback返回
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
 * 串行，applyEachSeries与applyEach唯一不同的是，数组的函数同步执行
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
    writeFile: ['getData', 'makeFolder', function(result, callback) {
        setTimeout(function() {
            console.log('write file');
            callback(null, 'myfile'); 
        }, 200);
    }],
    emailFiles: ['writeFile', function(result, callback) {
        setTimeout(function() {
            console.log(result.writeFile);
            callback(null, result.writeFile)
        }, 200);
    }]
}, function(err, data) {
    utils.log('[test auto] err: ', err); 
    utils.log('[test auto] data: ', data); 
});

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

/**
 * compose 组织一系列异步的方法的执行，每个方法需要消费上一个方法的返回值
 * 把f(),g(),h()异步函数，组合成f(g(h()))的形式，通过callback得到返回值
 */
//首先定义几个方法
function compose_A(n, callback) {
    utils.log('compose_A enter: ', n);
    setTimeout(function() {
        callback(null, n + 'A');
    }, 100);
}
function compose_B(n, callback) {
    utils.log('compose_B enter: ', n);
    setTimeout(function() {
        callback(null, n + 'B');
    }, 100);
}
function compose_C(n, callback) {
    utils.log('compose_C enter: ', n);
    setTimeout(function() {
        callback(null, n + 'C');
    }, 100);
}
//创建 compose 实例
var abc = async.compose(compose_C, compose_B, compose_A);
abc('start', function(err, result) {
    utils.log('compose err: ', err);
    utils.log('compose result: ', result);
});

/**
 * concat 将多个异步操作的结果合并成一个数组
 * concat(arr, iterator(item,callback(err,result)), callback(err,result))
 * 使用场景：对不同的数据源，进行同一个异步操作，把所有结果合并成一个数组
 */
//注：如果中途出错，则把错误以及已经完成的操作的结果交给最后callback。未执行完的则忽略
var arrs_concat = ['concatA', 'concatB', 'concatC'];
async.concat(arrs_concat, function(item, callback){
    setTimeout(function() {
        callback(null, item);
    }, 1000);
}, function(err, result) {
    utils.log('concat err: ', err);
    utils.log('concat result: ', result);
});
//concat 与 concatSeries 唯一的区别是concat是并行的，而concatSeries是串行的
var arrs_concatSeries = ['concatSeriesA', 'concatSeriesB', 'concatSeriesC'];
async.concatSeries(arrs_concatSeries, function(item, callback) {
    setTimeout(function() {
        callback(null, item);
    }, 1000);
}, function(err, result) {
    utils.log('concat err: ', err);
    utils.log('concat result: ', result);
});

/**
 * detect 用于取得集合中满足条件的第一个元素
 * detect和detectSeries 并行与串行
 */
arr_detect = [1,2,3,4,5,6];
async.detect(arr_detect, function(item, callback) {
    utils.log('detect enter: ', item);
    utils.inc(item, function(err, result) {
        console.log(result);
        callback(result%2 === 0);
    });
}, function(result) {
    utils.log('detect result: ', result);
});

/**
 * 按顺序依次执行一组函数。每个函数产生的值，都将传给下一个。
 * 如果中途出错，后面的函数将不会被执行。错误信息将传给waterfall最终的callback。之前产生的结果被丢弃。
 * async.waterfall(tasks, [callback]) 该函数不支持json格式的tasks
 */
async.waterfall([
    function(cb){ utils.log('waterfall_A: ', 'start'); cb(null, 3);},
    function(n, cb){ utils.log('waterfall_B: ', n); utils.inc(n, cb);},
    function(n, cb){ utils.log('waterfall_C: ', n); utils.fire(n*n, cb);},
], function(err, result) {
   utils.log('waterfall err: ', err);
   utils.log('waterfall result: ', result);
});