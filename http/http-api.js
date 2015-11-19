var http = require("http");

/**
 * http server
 */
http.createServer(function(req, res) {
	res.writeHead(200, {'Content-type': 'text/plain'});
	res.end("hello word pengchen...\n");
}).listen(1377, '127.0.0.1');

console.log('Server is running');

/**
 * http get
 */
http.get("http://www.baidu.com", function (res){
	console.log("the response is: \n" + res.statusCode);
}).on('error', function (e){
	console.log("error: \n" + e.message);
});

/**
 * http request
 */
//querystring.stringify 将对象转化为查询的参数字符串
var querystring = require('querystring');
var postData = querystring.stringify({
	'msg': 'hello world'
});

var options = {
  hostname: 'www.baidu.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': postData.length
  }
};

var req = http.request(options, function (res){
	console.log('status: ' + res.statusCode);
	console.log('headers: ' + JSON.stringify(res.headers));
	res.setEncoding('utf-8');
	res.on('data', function (){
		console.log("No more data in response");
	})
});

req.on('error', function (e){
	console.log("the has a error: " + e.message);
})

//将数据写入 request body
req.write(postData);
req.end();
