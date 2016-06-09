var server = require('http').createServer();
var path = require('path');

var httpHelper = require('./util/httpHelper');
var utils = require('./util/utils');
var chat = require('./lib/chat');

var port = process.env.PORT || 3000;
server.listen(port);

server.on('request', function(req, res) {
	var absPath = path.resolve(__dirname, req.url == '/' ? 'static/index.html' : 'static/' + req.url); 
	console.log('a request: ' + absPath);
	httpHelper.serverStatic(res, path.resolve(__dirname, absPath));
});
 
var io = require('socket.io')(server);
var guestNumber = 1;
io.on('connection', function(socket) {
	chat.init(socket, io);
	guestNumber = chat.assingnGuestName(guestNumber);
	chat.handleShowRooms();
});

console.log('Chat-room is on port ' + port + '!');