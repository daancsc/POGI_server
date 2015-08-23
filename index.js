//require是引入的意思，有點像是import，這部分做基本的引入這樣
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 25565;

//讓這個伺服器在port監聽，等待客戶從port連入
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// 將在public資料夾中的檔案傳送給客戶 (這我也不清楚不過是這樣的意思)
app.use(express.static(__dirname + '/public'));


//這邊是自訂的變數
var a = require('./server/game.js');
var usernames = {}; //儲存現在有的所有user的name
var numUsers = 0;   //儲存有多少user


//如果io現在有connection(連線)那就執行後面的function
io.on('connection', function (socket) {
    var addedUser = false;

    //有新用戶登入時
    socket.on('add user', function (username) {
        socket.username = username;
        usernames[username] = username;
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
            numUsers: numUsers
        });
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
    });
    
    //有訊息時
    socket.on('new message', function (data) {
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });
    });


    //隨便示範一個:
    socket.on('當發生了事件名稱', function (收到了傳入值) {
        
        socket.emit('發布訊息名稱', { //發布的話所有人都看得到
            發布內容項目1: "發布內容項目1中的內容",
            發布內容項目2: "發布內容項目2中的內容",
        });
        
        socket.broadcast.emit('廣播訊息名稱', { //廣播的話反而是所有人看到自己看不到
            廣播內容項目1: "廣播內容項目1中的內容",
            廣播內容項目2: "廣播內容項目2中的內容",
        });
    });


    socket.on('disconnect', function () {

        if (addedUser) {
            delete usernames[socket.username];
            --numUsers;


            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });
});