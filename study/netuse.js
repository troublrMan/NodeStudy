var net = require('net');

var host = '127.0.0.1';
var port = 6666;

/**
 * 测试
 */
function testSocket(count, wait) {
    var clientCount = 0;
    var times = setInterval(function() {
        client();
        clientCount++;
        if(clientCount >= count) clearInterval(times);
    }, wait);
}

/**
 * 模拟客户端
 */
function client() {
    var cli = new net.Socket();
    
    cli.connect(port, host, function() {
        console.log('client connect to the net server...');
        //连接到 net 服务器后写点儿数据测试
        cli.write('test data', 'utf8', function() {
           console.log('write success'); 
        });
    });
    
    cli.on('data', function(data) {
        console.log('从服务端接收的信息：' + data.toString());
    });
    
    cli.on('end', function() {
       //接收信息结束，测试一下客户端断开连接
       cli.destroy(); 
    });
}

/**
 * 模拟服务端
 */
exports.server = function() {
    
    var server = net.createServer(function(socket) {
        server.getConnections(function(err, count) {
            console.log('net server accept some connection...' + '有' + count + '个client连上了');
        });
        
        socket.on('data', function(data) {
            console.log(' from: ' + socket.remoteAddress + ' 接收客户端消息: ' + data.toString());
            //服务端接收消息后进行回复
            socket.write('I have accepted your messages..', 'utf8', function() {
                console.log('服务端已经发送回复...');
            });
            socket.end();
        });
        
        socket.on('close', function() {
            console.log('有个人断开了连接.........................'); 
        });
    });

    server.on('error', function(err) {
        console.error(err); 
    });

    server.listen(port, host, function() {
        console.log('listen on ' + host + ': ' + port);
        //listen 后起客户端测试
        testSocket(20, 1);
    });
    
};

exports.client = client;