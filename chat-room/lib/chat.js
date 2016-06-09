var utils = require('../util/utils');
var io = null;
var socket = null;

//昵称数组 ---先放在内存，后面放入redis
var nickNames = {};
var currentRoom = {
	length: 0
};
var namesUsed = [];

/**
 * 分配游客昵称
 * nickNames 昵称
 */
function assingnGuestName(guestNumber) {
	var name = 'Guest' + guestNumber;
	nickNames[socket.id] = name;
	socket.emit('nameResult', {
		success: true,
		name: name
	});
	namesUsed.push(name);
	return guestNumber + 1;
}

/**
 * 加入聊天房间
 * room 房间名
 * roomId 房间key
 */
function jionRoom(room, roomId) {
	socket.join(room);
	if(!roomId || !currentRoom[roomId]) {		
		currentRoom[socket.id] = room;
		currentRoom.length++;
	}
	socket.emit('jionResult', room);
	socket.broadcast.to(room).emit('message', {
		text: nickNames[socket.id] + 'has jioned ' + room
	});
	
	// var usersInRoom = io.socket.clients(room);
	io.in(room).clients(function(err, usersInRoom) {
		if(err) throw err;
		
		if(usersInRoom.length > 1) {
			var usersInRoomSummary = 'Users currently in ' + room  + ': ',
				users = [];
			for(var index in usersInRoom) {
				var userSocketId = usersInRoom[index];
				users.push(nickNames[userSocketId]);
			}
			
			usersInRoomSummary += users.join(',') + '.';
			socket.emit('tip', {text: usersInRoomSummary});
		}
	});
}

/**
 * 更改用户名称
 */
function handleNameChangeAttempts(nickNames, nameUsed) {
	socket.on('nameAttempt', function(name) {
		if(name.indexOf('Guest') == 0) {
			socket.emit('nameResult', {
				success: false,
				message: 'Names cannot begin with "guest".'
			});
		} else {
			if(namesUsed.indexOf(name) == -1) {
				var previousName = nickNames[socket.id];
				var previousNameIndex = namesUsed.indexOf(previousName);
				namesUsed.push(name);
				nickNames[socket.id] = name;
				delete namesUsed[previousNameIndex];
				
				socket.emit('nameResult', {
					success: true,
					name: name
				});
				
				socket.broadcast.to(currentRoom[socket.id].emit('message', {
					text: previousName + ' is now known as ' + name + '.'
				}));
			} else {
				socket.emit('nameResult', {
					success: false,
					message: 'That name is already in use'
				});
			}
		}
	});
}

/**
 * 发送聊天消息
 */
function handleMessageBroadcasting(message) {
	message.time = utils.getTime();
    socket.in(message.room).emit('message new', message);
}

/**
 * 显示当前可以加入的房间
 */
function handleShowRooms() {
    socket.emit('showRooms', currentRoom);
}

/**
 * 用户断开连接
 */
function handleClientDisconnection() {
    socket.on('disconnect', function() {
        var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
        delete namesUsed[nameIndex];
    })
}

module.exports = {
    assingnGuestName: assingnGuestName,
    jionRoom: jionRoom,
    handleNameChangeAttempts: handleNameChangeAttempts,
    handleMessageBroadcasting: handleMessageBroadcasting,
    handleClientDisconnection: handleClientDisconnection,
    handleShowRooms: handleShowRooms,
	init: function(_socket, _io) {
		socket = _socket;
		io = _io;
		socket.on('creatRoom', function(room) {
			socket.leave(currentRoom[socket.id]);
			jionRoom(room.newRoom);
		});
		socket.on('jionRoom', function(room) {
			jionRoom(room.roomName, room.roomId);
		});
		socket.on('creatMessage', function(message) {
			handleMessageBroadcasting(message);
		});
	}
}