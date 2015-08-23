var http = require('http').createServer(handle);
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;

http.listen(port, function() {
  console.log('Listening on ' + port);
});

function handle(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello World\n');
}

console.log('Server running at http://127.0.0.1:'+port);



io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
    socket.on('message',function($data){
        console.log(data);
        socket.emit('massage', { message: 'data' });
    });
    
});