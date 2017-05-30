//모듈 객체를 생성하고 server객체를 생성한다. 
var express = require('express');
var app = express();
var server = require('http').createServer(app);
//모듈 객체를 생성하고 socket.io객체를 생성한다. 
var io = require('socket.io').listen(server);

var fs = require('fs');
var path = require('path');

//포트설정
app.set('port',3000)
app.use(express.favicon());
//POST전송 받을때 post body 데이터를 읽기위함
app.use(express.bodyParser());
//static ���� ��� ����
app.use(express.static(path.join(__dirname, 'public')));

//서버실행
app.start = app.listen = app.aaa = function(){
	return server.listen.apply(server, arguments)
}
app.aaa(app.get('port'),function(){
	console.log("Server Start");
});

//모듈이 아닌 파일 include 방식사용
function include(file_) {
	with (global) {
		eval(fs.readFileSync(file_) + '');
	};
};

include(__dirname + "/config/include.js")

//config/include.js에 servicefile의 변수에 포함될 각각의 서비스를 개바랄 파일을 넣어준다. 

for(var i = 0 ; i < servicefile.length ; i++){
	include(__dirname + "/service/" + servicefile[i] );
}

//http의 모든 요청은 다음 구문에 들어오게 되므로 전체적인 처리가 필요한 부분들은 여기서 처리
app.all('*', function(req, res, next){
	next();
});
 