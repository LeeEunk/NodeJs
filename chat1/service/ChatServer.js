/**
 * Chat Server Source
 */
io.sockets.on('connection',function(socket){
	
	socket.on('roommake',function(data){

		socket.join(data.roomname);
		socket.set('room',data.roomname);
		socket.set('nickname',data.nickname);
		
		/*
		 * 채팅방 입장시 방에 입장해 있는 모든 사람에게 새로 입장한 사람의 닉네임을 표기해주는 부분 
		 * */
		socket.get('nickname',function(err,name){
			io.sockets.emit('roomlist',{"roomdata":io.sockets.manager.rooms,"clientid":socket.id,"nickname":name});
			socket.get("room",function(err,room){
				io.sockets.in(room).emit('intro',name);
			});
		});
	
	});
	
	//message ó��
	/*
	 * message를 받아서 해당 접속자의 닉네임, 방 정보를 얻어와 해당 방의 접속자에게 정보를 넘겨줍니다. 
	 * 이 message_send는 chat.html에서 받아서 화면에 뿌려주고 스크롤 내린다. 
	 * */
	socket.on('message',function(data){
		socket.get('nickname',function(err,name){
			socket.get('room',function(err,room){
				io.sockets.in(room).emit('message_send',{'msg':data.msg,'from':name});
			});
		});
	});
	
	//message ó��
	/*
	 * 퇴장시 처리는 socket.io에서 클라이언트와 서버의 연결이 끊어지면 서버의 disconnect 메소드를 자동 호출하게 되는데 이떄 채팅방에 
	 * 방 목록 정보 갱신한다. 
	 * */
	
	socket.on('disconnect', function () {
		//�� ��� ����
		socket.get('nickname',function(err,nickname){
			socket.get('room',function(err,room){
				io.sockets.in(room).emit('message_send_disconnect',{'msg':'','from':nickname});
			});
		});
		io.sockets.emit('room_research',null);
		
	});
	
});

