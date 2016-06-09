$(function() {
    var socket = io();
    var $send = $('.send'),
        $roomBody = $('.room-body'),
        nameDom = "<div>欢迎，{{name}}</div>",
        roomDom = "<span roomId='{{roomId}}'><a>{{name}}</a></span>",
        chatMessage =  "<div><span>{{name}}: </span><span>{{message}}</span><span> {{time}}</span></div>";
        
    var chat = {
        username: 'defualt',
        room: 'defualt',
        showMessage: function(message) {
            var $chatMessage = $(chatMessage.replace('{{name}}', message.username).replace('{{message}}', message.content).replace('{{time}}', message.time));
            $roomBody.append($chatMessage);
        },
        showUsername: function(name) {
            var $nameDom = $(nameDom.replace('{{name}}', name));
            $roomBody.append($nameDom);
        },
        showRooms: function(rooms, callback) {
            if(typeof rooms != 'object') return callback('参数有误');
            if(rooms.length > 0) {
                var roomDomStr = '<div id="joinRoom">欢迎加入';
                for(var roomId in rooms) {
                    if(roomId != 'length') {
                        roomDomStr += roomDom.replace('{{roomId}}', roomId).replace('{{name}}', rooms[roomId]);
                    }
                }
                roomDomStr += '房间</div>';
                $roomBody.append($(roomDomStr));
                $('#joinRoom span').on('click', function() {
                   var roomId = $(this).attr('roomid');
                   socket.emit('jionRoom', {
                       roomId: roomId,
                       roomName: rooms[roomId]
                   });
                });
            } else {
                var newRoomId = 'creatRoom_' + chat.username;
                $roomBody.append($("<div><span>当前没有可以加入的房间，请创建一个！</span><span id='" + newRoomId + "'><a> 创建房间</a></span></div>"));
                $('#' + newRoomId).on('click', function() {
                    socket.emit('creatRoom', {
                        newRoom: chat.username + '-room'
                    });
                });
                
            }
        },
        showTip: function(tip) {
            var tipDom = "<div>{{tip}}<div>";
            var $tipDom = $(tipDom.replace('{{tip}}', tip.text));
            $roomBody.append($tipDom);  
        },
        jionRoom: function(room, callback) {
            if(!room) return callback('加入房间失败');
            chat.room = room;
            $roomBody.append($("<div>加入" + room + "房间成功！</div>"))
        },
        bindDom: function() {
            $send.on('click', function() {
               var message = {
                   username: chat.username,
                   content: $('#message').val(),
                   room: chat.room
               };
               socket.emit('creatMessage', message);
            });
        }
    }
        
    chat.bindDom();
    
    socket.on('nameResult', function(data) {
       if(data.success) { 
           chat.username = data.name;
           chat.showUsername(data.name);
       } 
    });
    
    socket.on('message new', function(message) {
        chat.showMessage(message);
    });
    
    socket.on('showRooms', function(rooms) {
        chat.showRooms(rooms, function(err) {
            if(err) console.error(err);
        });
    });
    
    socket.on('jionResult', function(room) {
        chat.jionRoom(room, function(err) {
            if(err) console.error(err);
        });
    });
    
    socket.on('tip', function(tip){
        chat.showTip(tip);
    });
    
});