//require是引入的意思，有點像是import，這部分做基本的引入這樣
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 25565;
var tick = 0;

//讓這個伺服器在port監聽，等待客戶從port連入
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// 將在public資料夾中的檔案傳送給客戶 (這我也不清楚不過是這樣的意思)
app.use(express.static(__dirname + '/public'));


//這邊是自訂的變數
var gameCore = (require('./server/game.js').game);
var game = new gameCore();
var usernames = {}; //儲存現有user的name
var AInames = [
    '時時',
    '黑米',
    '葉子',
    '葉綠體',
    '捲餅',
    '果凍',
    '白米',
    '大元',
    '時時',
    '火柴',
    '人工智障',
    '涼麵趁熱吃',
    '謝謝',
    '軟今天',
    '湯姆嗑吐司',
    'photoshop',
    'GOOGLE',
    '土星'
];


console.log(game.teams);
gameLoop();

function addAI(name){
    
    while(usernames[name]==name){
        name = name+(Math.floor(Math.random()*99));
    }
    usernames[name] = name;
    
    var team = game.joinTeam({name: name, AI: true});
    
    io.sockets.emit('user login', {
        teams: game.teams,
    });
    
    io.sockets.emit('new join', {
        username: name,
        teams: game.teams,
        player: game.players[name],
        players: game.players
    });
}

for(var i=0;i<30;i++){
    addAI(AInames[Math.floor(Math.random()*AInames.length)]);
}

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
        var team = game.joinTeam({name: data.name, AI: false});
        
        socket.emit('join', {
            team: team,
            teams: game.teams,
            players: game.players,
            bullets: game.bullets,
            bases: game.bases
        });
        
        socket.broadcast.emit('new join', {
            username: socket.username,
            teams: game.teams,
            players: game.players
        });
        
        console.log(
            'user '+socket.username+' join team '+game.teams[team].name);
    });
    
    
    socket.on('update',function (data){
        if(socket.username == usernames[socket.username]){
            if(data.name!=undefined&&data.position!=undefined&&game.players[socket.username]!=undefined){
                game.players[socket.username].setPing();
                game.players[socket.username].timeout=0;/*
                if(game.players[socket.username].ping>2){
                    var dx = data.position.x-game.players[socket.username].position.x;
                    var dy = data.position.y-game.players[socket.username].position.y;
                    var d = Math.sqrt(dx*dx+dy*dy);
                    var v = Math.sqrt(data.velocity.x*data.velocity.x+data.velocity.x*data.velocity.x);
                    if(d<v*game.players[socket.username].ping*0.6) game.players[socket.username].position = data.position;
                    else {
                        game.players[socket.username].position.x = (game.players[socket.username].position.x+data.position.x)*0.5;
                        game.players[socket.username].position.y = (game.players[socket.username].position.y+data.position.y)*0.5;
                    }
                }*/
                game.players[socket.username].position = data.position;
                game.players[socket.username].velocity = data.velocity;
                game.players[socket.username].what=data.what;
            }
            /*
            if(game.players[socket.username].ping>10&&game.players[socket.username].ping<40){
                var fastgame = game;
                for(var i=0;i<10&&i<game.players[socket.username].ping*0.4-1;i++) fastgame.update();
                socket.emit('update', {
                    username: socket.username,
                    usernames: usernames,
                    players: fastgame.players,
                    teams: game.teams,
                    bullets: fastgame.bullets,
                    bases: fastgame.bases
                });
            }else{
                
                socket.emit('update', {
                    username: socket.username,
                    usernames: usernames,
                    players: game.players,
                    teams: game.teams,
                    bullets: game.bullets,
                    bases: game.bases
                });
            }*/
        }
    });
    
    socket.on('new bullet', function (data) {
        if(game.players[socket.username].numBullets>0){
            game.players[socket.username].numBullets--;
            if(game.players[socket.username].size<500)game.addBullet(game.players[socket.username].team, data.position, data.velocity, 200, 20);
            else {
                game.players[socket.username].numBullets-=20;
                game.addBullet(game.players[socket.username].team, data.position, data.velocity, 200, 100);
            }
        }
    });
    
    //隨便示範一個:
    socket.on('new message', function (data) {
        if(data.message[0]=='/'){
            if(data.message=='/reset') game.reset();
            if(data.message.substring(0,4)=='/say') {
                socket.emit('new message', { 
                    name: '[POGI_SERVER]',
                    message: data.message.substring(4)
                });

                socket.broadcast.emit('new message', {
                    name: '[POGI_SERVER]',
                    message: data.message.substring(4)
                });
            }
            if(data.message.substring(0,6)=='/newAi') {
                addAI(data.message.substring(6));
            }
        }else{
            socket.emit('new message', { 
                name: ' '+socket.username,
                message: data.message,
            });

            socket.broadcast.emit('new message', { 
                name: ' '+socket.username,
                message: data.message,
            });
        }
    });
    
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
var player = require('./server/player.js').player;
function gameLoop() {
    tick ++;
    /*
    for(i in game.players){
        if(game.players[i]!=undefined&&game.players[i].AI){
            var aimen = new player('default',-1,{x:0,y:0},true);
            aimen = game.players[i];
            var aisays = aimen.AIcalc(game);
            if(aimen!=undefined&&aimen.numBullets>0&&aisays.shoot!=false){
                game.addBullet(aimen.team, aisays.shoot.from, aisays.shoot.speed, 100, 20);
                aimen.numBullets--;
            }
            delete aimen;
        }
    }
    */
    game.AImove();
    game.update();
    for(i in game.players){
        if(game.players[i].timeout>500) {
            var username = game.players[i].name;
            delete usernames[username];
            //delete game.teams[game.players[i].team].playernames[username];
            delete game.players[i];
        }
    }
    
    
    
    if(tick%5==0){
        io.sockets.emit('update', game.simData());
    }
    //console.log(game.players);
    /*
    var text='';
    for(i in game.players){
        var player = game.players[i];
        text+= player.name+' '+player.position.x+' , '+player.position.y;
    }
    console.log(text);*/
    setTimeout(gameLoop, 10);
    return 0;
}