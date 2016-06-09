var Redis = require('ioredis');     //extends: EventEmitter, Commander
var redis = new Redis();
var pub = new Redis();

var test = {
    start: function() {
        test.testPipelining();
    },
    /**
     * 测试 Pipeline，能够批量处理redis命令
     */
    testPipelining: function() {
        var pipelining = redis.pipeline();
        pipelining.set('foo1', 'bar1');
        pipelining.set('foo2', 'bar2');
        pipelining.del('foo2');
        pipelining.del('cc');
        pipelining.exec(function(err, results) {
           console.log(results);   //[ [ null, 'OK' ], [ null, 'OK' ], [ null, 1 ], [ null, 0 ] ]
        });
        
        redis.pipeline().set('foo', 'bar').del('cc').exec(function (err, results) {
            console.log(results);  //[ [ null, 'OK' ], [ null, 0 ] ]
        });
    },
    /**
     * 测试 Binary
     */
    testBinary: function() {
        redis.set('foo', new Buffer('bar'));
        redis.getBuffer('foo', function(err, result) {
           console.log(result); 
        });
    },
    /**
     * 测试 subscribe
     */
    testSubscribe: function() {
        redis.subscribe('news', 'music', function(err, count) {
            pub.publish('news', '1111111');
            pub.publish('music', '222222');
        });

        redis.on('message', function(channel, message) {
            console.log('Receive message %s from channel %s', message, channel);
        });

        redis.on('messageBuffer', function(channel, message) {
            console.log('********');
        });
    }
}

test.start();