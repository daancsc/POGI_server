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
        velocity: {x: players[myname].velocity.x, y: players[myname].velocity.y}
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
    players[data.username] = data.player;
    console.log('new user: '+players[data.username].name);
    
    updateGamepage();
    updateTeamData();
    newlog('[玩家 '+data.username+' 加入遊戲]');
});

socket.on('new message', function (data){
    newlog(data.name +'： '+data.message);
});

socket.on('update', function (data){
    usernames = data.usernames;
    for(i in data.players){//player
        if(data.players[i]!=undefined)
            players[i] = data.players[i];
    }
    if(data.players!=undefined){
        for(i in players){
            if(data.players[i]==undefined){
                newlog('[玩家'+i+'離開遊戲]');
                delete players[i];
            }
        }
    }
    
    for(i in data.bullets){//bullets
        if(data.bullets[i]!=undefined)
            bullets[i] = data.bullets[i];
    }
    
    if(data.bullets!=undefined){
        for(i in bullets){
            if(data.bullets[i]==undefined)
                delete bullets[i];
        }
    }
    
    for(i in data.bases){//bullets
        if(data.bases[i]!=undefined)
            bases[i] = data.bases[i];
    }
    if(data.bases!=undefined){
        for(i in bases){
            if(data.bases[i]==undefined)
                delete bases[i];
        }
    }
    
    teams = data.teams;
    updateGamepage();
    updateTeamData();
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