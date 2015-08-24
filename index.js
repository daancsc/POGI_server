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
var game = new (require('./server/game.js').game)();
var usernames = {}; //儲存現有user的name
var userdatas = {}; //儲存現有user的data


console.log(game.teams);
gameLoop();
//如果io現在有connection(連線)那就執行後面的function
io.on('connection', function (socket) {
    var addedUser = false;

    //有新用戶登入時
    socket.on('add user', function (data) {
        
        while(usernames[data.username]==data.username){
            data.username = 
                data.username+(Math.floor(Math.random()*99));
        }
        
        socket.username = data.username;
        console.log('add user '+socket.username);
        usernames[data.username] = data.username;
        addedUser = true;
        
        socket.emit('login', {
            name: socket.username,
            teams: game.teams,
            usernames: usernames
        });
        
        socket.broadcast.emit('user login', {
            teams: game.teams,
        });
        
        console.log(
            'user '+socket.username+' login');
    });
    
    //有訊息時
    socket.on('join team', function (data) {
        var team = game.joinTeam(data);
        
        socket.emit('join', {
            team: team,
            teams: game.teams,
            players: game.players
        });
        
        socket.broadcast.emit('new join', {
            username: socket.username,
            teams: game.teams,
            player: game.players[socket.username]
        });
        
        console.log(
            'user '+socket.username+' join team '+game.teams[team].name);
    });
    
    
    socket.on('update',function (data){
        if(socket.username == usernames[socket.username]){
            if(data.name!=undefined&&data.position!=undefined){
                game.players[socket.username].timeout=200;
                game.players[socket.username].position = data.position;
            }
            
            socket.emit('update', {
                username: socket.username,
                usernames: usernames,
                players: game.players,
                teams: game.teams
            });
        }
    });
    
    //隨便示範一個:
    socket.on('當發生了事件名稱', function (收到了傳入值) {
        
        socket.emit('發布訊息名稱', { //不確定耶..抱歉阿
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
            
            
            socket.broadcast.emit('user left', {
                username: socket.username,
            });
        }
    });
});

function gameLoop() {
    game.update();
    for(i in game.players){
        game.players[i].update();
        if(game.players[i].timeout<0) {
            var username = game.players[i].name;
            delete usernames[username];
            delete game.teams[game.players[i].team].playernames[username];
            delete game.players[i];
        }
    }
    console.log(game.players);
    /*
    var text='';
    for(i in game.players){
        var player = game.players[i];
        text+= player.name+' '+player.position.x+' , '+player.position.y;
    }
    console.log(text);*/
    setTimeout(gameLoop, 50);
    return 0;
}