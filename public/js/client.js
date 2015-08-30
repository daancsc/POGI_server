var socket = io();

var usernames = {}; //儲存現在有的所有user的name

var teams = [];

var myid = undefined;
var myTeam;

var players = {};
var pplayers = {};

var bullets = [];
var pbullets = [];

var bases = [];
var pbases = [];

var ftm = false;
var gameTimer = 0;
var gameStatus = '';

var gameScore = {
    size:{
        max: 0,
        list: []
    },
    attack:{
        max: 0,
        list: []
    },
    help:{
        max: 0,
        list: []
    },
    capture:{
        max: 0,
        list: []
    }
};

function named () {
    var text = document.getElementById('name');
    socket.emit('add user',{
        username: text.value
    });
    text.value = '';
}

function joined () {
    socket.emit('join team',{
        id: myid,
    });
}

function updateData (){
    socket.emit('update',{
        id: myid,
        position: {x: players[myid].position.x, y: players[myid].position.y},
        velocity: {x: pplayers[myid].velocity.x, y: pplayers[myid].velocity.y},
        what: what
    });
}

function refreshData(){
    for(i in bases){
        if(bases[i]===null){
            monitor_base[i]=4;
            delete bases[i];
            delete pbases[i];
        }
    }
    for(i in players){
        if(players[i]===null||players[i]==undefined){
            if(i==myid){
                console.log('[您因為閒置過久\n(切換至其他畫面導致無法進行伺服器同步計算)\n伺服器已主動將您登出]');
                isJoin = false;
                monitor_player[i]=4;
                players[i]={
                    type: 'player',
                    life: 100,
                    team: -1,
                    size: 100,
                    position: {x:0, y:0},
                    velocity: {x:0, y:0},
                    numBullets: 100
                };
            }else{
                monitor_player[i]=4;
                delete players[i];
                delete pplayers[i];
            }
        }
    }
}

function addBullet (position, velocity){
    socket.emit('new bullet', {
        id: myid,
        position: position,
        velocity: velocity
    });
}

function chat () {
    var text = document.getElementById('message');
    if(text.value!=''&&text.value.length<40){
        socket.emit('new message',{id:myid, message: text.value});
        text.blur();
        text.value = '';
    }
    else {
        newlog('[請重新決定您要發送的訊息]');
    }
    
}

function textChanged(){
    var text = document.getElementById('message');
    if(reTextbox &&( text.value=='t'||text.value=='T')){
        text.value = '';
        reTextbox = false;
    }
}

socket.on('login', function (data){
    myid = data.id;
    teams = data.teams;
    usernames = data.usernames;
    //updateTeamData();
    
    document.getElementById('loginPage').style.display='none';
    document.getElementById('joinPage').style.display='block';
    //document.getElementById('gameStatus').style.display='block';
});

socket.on('user login', function (data){
    usernames = data.usernames;
    newlog('[玩家 '+usernames[data.id]+' 上線中]');
});

socket.on('join', function (data){
    
    myTeam = data.team;
    teams = data.teams;
    players = data.players;
    pplayers[myid] = {
        type: 'player',
        life: 100,
        team: data.players[myid].team,
        size: data.players[myid].size,
        position: data.players[myid].position,
        velocity: data.players[myid].velocity,
        numBullets: data.players[myid].numBullets
    }
    //pplayers = data.players;
    bullets = data.bullets;
    bases = data.bases;
    
    gameStatus = data.gameStatus;
    //pplayers = data.players;
    console.log('join');
    
    
    document.getElementById("me").innerHTML = 
        'id='+myid+'\n'+
        'Team='+myTeam+'\n';
    
    updateGamepage();
    updateTeamData();
    
    document.getElementById('joinPage').style.display='none';
    //document.getElementById('gamePage').style.display='block';
    document.getElementById('processing').style.display='block';
    document.getElementById('chat').style.display='block';
    isJoin=true;
    newlog('[我 '+usernames[myid]+' 已加入遊戲]');
});

socket.on('new join', function (data){
    //teams = data.teams;
    //players = data.players;
    console.log('new user: '+usernames[data.id]);
    
    updateGamepage();
    updateTeamData();
    newlog('[玩家 '+usernames[data.id]+' 加入遊戲]');
});

socket.on('new message', function (data){
    if(data.id!=-1)
        newlog(usernames[data.id] +'：'+data.message);
    else
        newlog('[POGI伺服器：'+data.message+']');
});

socket.on('update', function (data){
    if(isJoin){
        if(data.ftm!=undefined) ftm = data.ftm;
        if(data.gameTimer!=undefined) gameTimer = data.gameTimer;
        if(data.gameStatus!=undefined) gameStatus = data.gameStatus;
        if(data.gameScore!=undefined){
            gameScore = data.gameScore;
        }
        
        for(i in data.players){//player
            if(players[i]==undefined){
                monitor_player[i] = 3;
                players[i]={
                    type: 'player',
                    life: 100,
                    team: -1,
                    size: 100,
                    position: {x:0, y:0},
                    velocity: {x:0, y:0},
                    numBullets: 100
                };
            }
            if(data.players[i]!=undefined){
                if(data.players[i].life!=undefined)players[i].life = data.players[i].life;
                if(data.players[i].ping!=undefined)players[i].ping = data.players[i].ping;
                if(data.players[i].team!=undefined)players[i].team = data.players[i].team;
                if(data.players[i].size!=undefined)players[i].size = data.players[i].size;
                if(data.players[i].position!=undefined)players[i].position = data.players[i].position;
                if(data.players[i].velocity!=undefined){players[i].velocity = data.players[i].velocity; monitor_player[i] = 2;}
                if(data.players[i].numBullets!=undefined){players[i].numBullets = data.players[i].numBullets;monitor_player[i] = 3;}
            }
        }
        for(i in data.dplayers){
            
            if(players[i]!=undefined) {
                monitor_player[i] = 4;
                delete players[i];
                if(pplayers[i]!=undefined)pplayers[i].life = 0;
                newlog('[玩家 '+usernames[i]+' 離開遊戲]');
            }
        }
        for(i in players){
            
            if(players[i]!=undefined&&(data.players[i]==undefined||data.players[i]===null)){
                monitor_player[i] = 4;
                delete players[i];
                if(pplayers[i]!=undefined)pplayers[i].life = 0;
                newlog('[玩家 '+usernames[i]+' 離開遊戲]');
            }
        }
        
        for(i in data.bullets){//bullets
            if(bullets[i]==undefined){
                monitor_bullet[i]= 3;
                bullets[i]={
                    type: 'bullet',
                    team: -1,
                    size: 20,
                    position: {x:0, y:0},
                    velocity: {x:0, y:0}
                };
            }
            if(data.bullets[i]!=undefined){
                if(data.bullets[i].life!=undefined)bullets[i].life = data.bullets[i].life;
                if(data.bullets[i].team!=undefined)bullets[i].team = data.bullets[i].team;
                if(data.bullets[i].size!=undefined)bullets[i].size = data.bullets[i].size;
                if(data.bullets[i].velocity!=undefined)bullets[i].velocity = data.bullets[i].velocity;
                if(data.bullets[i].position!=undefined){
                    bullets[i].position = data.bullets[i].position;
                }
                
                
            }
        }
        for(i in data.dbullets){
            if(bullets[i]!=undefined) {
                if(monitor_bullet[i]==4)
                    monitor_bullet[i]= 2;
                else monitor_bullet[i]= 4;
                delete bullets[i];
                if(pbullets[i]!=undefined)pbullets[i].life = 0;
            }
        }
        for(i in bullets){
            
            if(bullets[i]!=undefined&&(data.bullets[i]==undefined||data.bullets[i]===null)){
                if(monitor_bullet[i]==4)
                    monitor_bullet[i]= 2;
                else monitor_bullet[i]= 4;
                
                delete bullets[i];
                if(pbullets[i]!=undefined)pbullets[i].life = 0;
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
                
                if(data.bases[i].life!=undefined)bases[i].life = data.bases[i].life;
                if(data.bases[i].team!=undefined)bases[i].team = data.bases[i].team;
                if(data.bases[i].size!=undefined){bases[i].size = data.bases[i].size; monitor_base[i] = 3;}
                if(data.bases[i].position!=undefined)bases[i].position = data.bases[i].position;
                if(data.bases[i].velocity!=undefined){bases[i].velocity = data.bases[i].velocity; monitor_base[i] = 3;}
                if(data.bases[i].border!=undefined)bases[i].border = data.bases[i].border;
            }
        }
        for(i in data.dbases){
            if(bases[i]!=undefined) {
                delete bases[i];
                if(pbases[i]!=undefined)pbases[i].life = 0;
            }
        }
        for(i in bases){
            if(bases[i]!=undefined&&(data.bases[i]==undefined||data.bases[i]===null)){
                delete bases[i];
                if(pbases[i]!=undefined)pbases[i].life = 0;
            }
        }
        
        for(i in data.teams){//bases
            if(data.teams[i]!=undefined){
                if(data.teams[i].name!=undefined)teams[i].name = data.teams[i].name;
                if(data.teams[i].ids!=undefined)teams[i].ids = data.teams[i].ids;
            }
        }
        
        updateGamepage();
        updateTeamData();
    }
});



function updateGamepage(){
    var content = document.getElementById("users");
    var text = '';
    for(i in usernames){
        text+=usernames[i].name+',';
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
        for(j in teams[i].ids){
            text+=teams[i].ids[j]+', ';
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

var length = function(point){
    return Math.sqrt(point.x*point.x+point.y+point.y);
}

var sub = function(pointa,pointb){
    return length({
        x: pointa.x-pointb.x,
        y: pointa.y-pointb.y
    })
}