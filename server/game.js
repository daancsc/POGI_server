var player = require('player.js').player;
var team = require('team.js').team;

exports.var playerDatas = {};
exports.var numPlayer = 0;
exports.var teams = [
    team('隊伍一',0,'#FF0000'),
    team('隊伍二',1,'#ffce00'),
    team('隊伍三',2,'#48f71e'),
    team('隊伍四',3,'#1ebaff')
];


exports.function joinTeam(data){
    var avalibleTeams = [];
    var minNumPlayers = 9999;
    for(i in teams){ //找到所有最少人數隊伍
        if(teams[i].numPlayers<=minNumPlayers) {
            if(teams[i].numPlayers<=minNumPlayers)
                avalibleTeams=[];
            minNumPlayers=teams[i].numPlayers
            avalibleTeams.push(i);
        }
    }
    
    teams[avalibleTeams[Math.random(avalibleTeams.length)]].join(data);
    return i;
}
