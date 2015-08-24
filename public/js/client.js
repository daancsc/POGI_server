var socket = io();

var usernames = {}; //儲存現在有的所有user的name

var teams = [];

var myname = '';
var myTeam;

var players = [];
var dplayers = [];

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
        position: {x: mouseX, y: mouseY}
    });
}

socket.on('login', function (data){
    myname = data.name;
    teams = data.teams;
    
    //updateTeamData();
    
    document.getElementById('loginPage').style.display='none';
    document.getElementById('joinPage').style.display='block';
    document.getElementById('gameStatus').style.display='block';
});

socket.on('join', function (data){
    
    myTeam = data.team;
    teams = data.teams;
    players = data.players;
    dplayers = data.players;
    
    document.getElementById("me").innerHTML = 
        'Name='+myname+'\n'+
        'Team='+myTeam+'\n';
    
    updateGamepage();
    updateTeamData();
    document.getElementById('joinPage').style.display='none';
    document.getElementById('gamePage').style.display='block';
    document.getElementById('processing').style.display='block';
    isJoin=true;
});

socket.on('new join', function (data){
    usernames[data.username] = data.username;
    teams = data.teams;
    players = data.players;
    
    updateGamepage();
    updateTeamData();
});

socket.on('update', function (data){
    usernames = data.usernames;
    players = data.players;
    
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