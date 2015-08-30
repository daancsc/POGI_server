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
var ids = 0;
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

function newIds(){
    var keep = 0;
    for(i in usernames){
        if(keep==i) keep++;
    }
    ids = keep;
}


function addAI(name){
    
    var same = true;
    while(same){
        same = false;
        for(i in usernames)if(usernames[i] == name){same=true; break;}
        if(!same)break;
        name = 
            name+(Math.floor(Math.random()*99));
    }
    usernames[ids] = name;
    
    var team = game.joinTeam({id: ids, AI: true});
    
    io.sockets.emit('user login', {
        id: ids,
        usernames: usernames,
    });
    
    io.sockets.emit('new join', {
        id: ids,
        teams: game.teams,
        players: game.players
    });
    newIds();
}

for(var i=0;i<0;i++){
    addAI(AInames[Math.floor(Math.random()*AInames.length)]);
}

//如果io現在有connection(連線)那就執行後面的function
io.on('connection', function (socket) {
    var addedUser = false;

    //有新用戶登入時
    socket.on('add user', function (data) {
        
        var same = true;
        while(same){
            same = false;
            for(i in usernames)if(usernames[i] == data.username){same=true; break;}
            if(!same)break;
            data.username = 
                data.username+(Math.floor(Math.random()*99));
        }
        
        //socket.username = data.username;
        console.log('add user '+data.username);
        usernames[ids] = data.username;
        
        addedUser = true;
        
        socket.emit('login', {
            id: ids,
            teams: game.teams,
            usernames: usernames
        });
        
        socket.broadcast.emit('user login', {
            id: ids,
            usernames: usernames,
        });
        
        console.log(
            'user '+usernames[ids]+' login');
        
        newIds();
    });
    
    //有訊息時
    socket.on('join team', function (data) {
        var team = game.joinTeam({id: data.id, AI: false});
        
        socket.emit('join', {
            team: team,
            teams: game.teams,
            players: game.players,
            bullets: game.bullets,
            bases: game.bases,
            gameStatus: game.gameStatus
        });
        
        socket.broadcast.emit('new join', {
            id: data.id,
            teams: game.teams,
            players: game.players
        });
        
        console.log(
            'user '+usernames[data.id]+' join team '+game.teams[team].name);
    });
    
    
    socket.on('update',function (data){
        if(usernames[data.id]!=undefined){
            if(game.players[data.id]!=undefined&&!game.forceToMove){
                game.players[data.id].setPing();
                game.players[data.id].position = data.position;
                game.players[data.id].velocity = data.velocity;
                game.players[data.id].what=data.what;
            }
        }
    });
    
    socket.on('new bullet', function (data) {
        if(usernames[data.id]!=undefined&&game.players[data.id]!=undefined){
            if(game.players[data.id].numBullets>0){
                game.players[data.id].numBullets--;
                if(game.players[data.id].size<500)game.addBullet(game.players[data.id], game.players[data.id].team, data.position, data.velocity, 200, 20);
                else {
                    game.players[data.id].numBullets-=20;
                    game.addBullet(game.players[data.id], game.players[data.id].team, data.position, data.velocity, 200, 100);
                }
            }
        }
    });
    
    //隨便示範一個:
    socket.on('new message', function (data) {
        if(data.message[0]=='/'){
            if(data.message=='/reset') {
                game.reset();
            }
            if(data.message.substring(0,4)=='/say') {
                socket.emit('new message', { 
                    id: -1,
                    message: data.message.substring(4)
                });

                socket.broadcast.emit('new message', {
                    id: -1,
                    message: data.message.substring(4)
                });
            }
            if(data.message.substring(0,6)=='/newAi') {
                var arg = data.message.substring(6);
                if(arg[0]===' '){
                    for(var i=0;i<arg.substring(1)&&i<200;i++){
                        addAI(AInames[Math.floor(Math.random()*AInames.length)]);
                    }
                }else{
                    addAI(data.message.substring(6));
                }
                
            }
        }else{
            socket.emit('new message', { 
                id: data.id,
                message: data.message,
            });

            socket.broadcast.emit('new message', { 
                id: data.id,
                message: data.message,
            });
        }
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
    
    game.AImove();
    game.update();
    for(i in game.players){
        if(game.players[i].timeout>500) {
            delete usernames[i];
            delete game.players[i];
            //delete game.teams[game.players[i].team].playernames[username];
        }
    }
    
    if(tick%10==0){
        io.sockets.emit('update', game.simData());
        game.forceToMove = false;
    }
    setTimeout(gameLoop, 14);
    return 0;
}