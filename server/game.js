var player = require('./player.js').player;
var team = require('./team.js').team;

exports.game = function(){
    this.players  = {};
    this.teams = [
        new team('隊伍一',0,'#FF0000'),
        new team('隊伍二',1,'#ffce00'),
        new team('隊伍三',2,'#48f71e'),
        new team('隊伍四',3,'#1ebaff')
    ];
    
    this.getTeams = function(){
        return this.teams;
    }
    
    this.joinTeam = function(data){
        var avalibleTeams = [];
        var minNumPlayers = 9999;
        for(i in this.teams){ //找到所有最少人數隊伍
            var num = this.teams[i].numPlayers();
            if(num<=minNumPlayers) {
                if(num<minNumPlayers){
                    avalibleTeams=[];
                    minNumPlayers=num;
                }
                avalibleTeams[avalibleTeams.length]=i;
            }
        }
        
        var teamId = avalibleTeams[Math.floor(Math.random()*avalibleTeams.length)];
        this.teams[teamId].join(data);
        this.players[data.name] = 
            new player(data.name, teamId, {x: 0, y: 0});
        return teamId;
    }
    
    this.update = function(){
        
        return false;
    }
    
    return false;
}