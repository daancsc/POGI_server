var socket = io();

var usernames = {}; //儲存現在有的所有user的name

var teams = [];

var myname = '';
var myTeam;

var players = [];
var pplayers = [];

var bullets = [];
var pbullets = [];

var bases = [];
var pbases = [];

function named () {
    var text = document.getElementById('name');
    socket.emit('add user',{username: text.value});
    text.value = '';
}

function joined () {
    socket.emit('join team',{
        name: myname,
    });
}

function updateData (){
    socket.emit('update',{
        name: myname,
        position: {x: players[myname].position.x, y: players[myname].position.y},
        velocity: {x: players[myname].velocity.x, y: players[myname].velocity.y},
        what: what
    });
}

function addBullet (position, velocity){
    socket.emit('new bullet', {
        position: position,
        velocity: velocity
    });
}

function chat () {
    var text = document.getElementById('message');
    socket.emit('new message',{message: text.value});
    text.value = '';
}
socket.on('login', function (data){
    myname = data.name;
    teams = data.teams;
    
    //updateTeamData();
    
    document.getElementById('loginPage').style.display='none';
    document.getElementById('joinPage').style.display='block';
    //document.getElementById('gameStatus').style.display='block';
});

socket.on('user login', function (data){
    teams = teams;
    newlog('[有玩家加入了]');
});

socket.on('join', function (data){
    
    myTeam = data.team;
    teams = data.teams;
    players = data.players;
    bullets = data.bullets;
    bases = data.bases;
    //pplayers = data.players;
    console.log('join');
    
    
    document.getElementById("me").innerHTML = 
        'Name='+myname+'\n'+
        'Team='+myTeam+'\n';
    
    updateGamepage();
    updateTeamData();
    
    document.getElementById('joinPage').style.display='none';
    //document.getElementById('gamePage').style.display='block';
    document.getElementById('processing').style.display='block';
    document.getElementById('chat').style.display='block';
    isJoin=true;
    newlog('[我 '+myname+' 已加入遊戲]');
});

socket.on('new join', function (data){
    usernames[data.username] = data.username;
    teams = data.teams;
    players = data.players;
    console.log('new user: '+players[data.username].name);
    
    updateGamepage();
    updateTeamData();
    newlog('[玩家 '+data.username+' 加入遊戲]');
});

socket.on('new message', function (data){
    newlog(data.name +'： '+data.message);
});

socket.on('update', function (data){
    if(isJoin){
        for(i in data.players){//player
            if(players[i]==undefined){
                players[i]={
                    type: 'player',
                    team: -1,
                    size: 100,
                    position: {x:0, y:0},
                    velocity: {x:0, y:0},
                    numBullets: 100
                };
            }
            if(data.players[i]!=undefined){
                if(data.players[i].ping!=undefined)players[i].ping = data.players[i].ping;
                if(data.players[i].team!=undefined)players[i].team = data.players[i].team;
                if(data.players[i].size!=undefined)players[i].size = data.players[i].size;
                if(data.players[i].position!=undefined)players[i].position = data.players[i].position;
                if(data.players[i].velocity!=undefined)players[i].velocity = data.players[i].velocity;
                if(data.players[i].numBullets!=undefined)players[i].numBullets = data.players[i].numBullets;
            }
        }
        for(i in data.dplayers){
            if(players[i]!=undefined) {
                delete players[i];
                delete pplayers[i];
                newlog('[玩家 '+i+' 離開遊戲]');
            }
        }
        for(i in players){
            if(players[i]!=undefined&&data.players[i]==undefined){
                delete players[i];
                delete pplayers[i];
                newlog('[玩家 '+i+' 離開遊戲]');
            }
        }
        
        for(i in data.bullets){//bullets
            if(bullets[i]==undefined){
                bullets[i]={
                    type: 'bullet',
                    team: -1,
                    size: 20,
                    position: {x:0, y:0},
                    velocity: {x:0, y:0}
                };
            }
            if(data.bullets[i]!=undefined){
                if(data.bullets[i].team!=undefined)bullets[i].team = data.bullets[i].team;
                if(data.bullets[i].size!=undefined)bullets[i].size = data.bullets[i].size;
                if(data.bullets[i].position!=undefined)bullets[i].position = data.bullets[i].position;
                if(data.bullets[i].velocity!=undefined)bullets[i].velocity = data.bullets[i].velocity;
            }
        }
        for(i in data.dbullets){
            if(bullets[i]!=undefined) {
                delete bullets[i];
                delete pbullets[i];
            }
        }
        for(i in bullets){
            if(bullets[i]!=undefined&&data.bullets[i]==undefined){
                delete bullets[i];
                delete pbullets[i];
            }
        }
        
        for(i in data.bases){//bases
            if(bases[i]==undefined){
                bases[i]={
                    type: 'base',
                    team: -1,
                    size: 500,
                    position: {x:0, y:0},
                    velocity: {x:0, y:0},
                    border: false
                };
            }
            if(data.bases[i]!=undefined){
                if(data.bases[i].team!=undefined)bases[i].team = data.bases[i].team;
                if(data.bases[i].size!=undefined)bases[i].size = data.bases[i].size;
                if(data.bases[i].position!=undefined)bases[i].position = data.bases[i].position;
                if(data.bases[i].velocity!=undefined)bases[i].velocity = data.bases[i].velocity;
                if(data.bases[i].border!=undefined)bases[i].border = data.bases[i].border;
            }
        }
        for(i in data.dbases){
            if(bases[i]!=undefined) {
                delete bases[i];
                delete pbases[i];
            }
        }
        for(i in bases){
            if(bases[i]!=undefined&&data.bases[i]==undefined){
                delete bases[i];
                delete pbases[i];
            }
        }
        
        for(i in data.teams){//bases
            if(data.teams[i]!=undefined){
                if(data.teams[i].name!=undefined)teams[i].name = data.teams[i].name;
                if(data.teams[i].playernames!=undefined)teams[i].playernames = data.teams[i].playernames;
            }
        }
        
        updateGamepage();
        updateTeamData();
    }
});



function updateGamepage(){
    var content = document.getElementById("users");
    var text = '';
    for(i in players){
        text+=players[i].name+',';
    }
    content.innerHTML = text;
}

function updateTeamData(){
    var content = [
        document.getElementById("team1"),
        document.getElementById("team2"),
        document.getElementById("team3"),
        document.getElementById("team4"),
        ];
    
    for(i in content){
        var text = '';
        var num = 0;
        for(j in teams[i].playernames){
            text+=teams[i].playernames[j]+', ';
            num++;
        }
        content[i].innerHTML = 
            teams[i].name+' '+
            num+'人\n：'+text;
    }
}

var len = function(list) {
    var out = list.length;
    if(out == undefined) return 0;
    return out;
}