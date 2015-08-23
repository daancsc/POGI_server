var http = require('http').createServer(handler);
var io = require('socket.io')(http);
var fs = require('fs');

var port = process.env.PORT || 3000;

http.listen(port, function() {
  console.log('Listening on ' + port);
});

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
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