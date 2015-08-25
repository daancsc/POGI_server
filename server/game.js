var player = require('./player.js').player;
var bullet = require('./bullets.js').bullet;
var base = require('./base.js').base;
var team = require('./team.js').team;

exports.game = function(){
    this.players = {};
    this.bullets = [];
    this.bases = [
        new base(0 ,{x: 1000, y: 1000},400),
        new base(1 ,{x: -1000, y: -1000},400),
        new base(2 ,{x: 1000, y: -1000},400),
        new base(3 ,{x: -1000, y: 1000},400),
        
        new base(-1 ,{x: 200, y: 200},300),
        new base(-1 ,{x: -200, y: -200},300),
        new base(-1 ,{x: -200, y: 200},300),
        new base(-1 ,{x: 200, y: -200},300),
    ];
    
    this.teams = [
        new team('P',0,'#e62d2d'),
        new team('O',1,'#ffce00'),
        new team('G',2,'#48f71e'),
        new team('I',3,'#1ebaff')
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
        for(i in this.players){
            this.players[i].update();
        }
        for(i in this.bullets) {
            for(j in this.bullets) {
                if(i!=j){
                    this.bullets[i].collide(this.bullets[j]);
                }
            }
            for(j in this.players) {
                if(this.bullets[i].team!=this.players[j].team){
                    this.bullets[i].collide(this.players[j]);
                }
            }
        }
        for(i in this.bullets) {
            this.bullets[i].update();
            if(this.bullets[i].life<0)
                delete this.bullets[i];
        }
        
        for(i in this.players){
            for(j in this.players) if(i!=j)this.players[i].collide(this.players[j]);
            for(j in this.bullets) if(this.players[i].team != this.bullets[j].team )this.players[i].collide(this.bullets[j]);
            for(j in this.bases) if(this.players[i].team != this.bases[j].team )this.players[i].collide(this.bases[j]);
        }
        
        for(i in this.bases){
            if(this.bases[i].size>1000){
                this.bases[i].size = 500;
                this.addBase(this.bases[i].team,{
                    x: this.bases[i].position.x + (Math.random()*100-50)*3,
                    y: this.bases[i].position.y + (Math.random()*100-50)*3
                },500);
            }
            
            this.bases[i].update();
            for(j in this.bases) if(i!=j) this.bases[i].collide(this.bases[j]);
            for(j in this.bullets) this.bases[i].collide(this.bullets[j]);
            this.bases[i].clearTargets();
            for(j in this.players) if(this.bases[i].team!=this.players[j].team) this.bases[i].findTarget(this.players[j]);
            for(j in this.bases) if(i!=j) if(this.bases[i].findTarget(this.bases[j]));
            var shoot = this.bases[i].shoot();
            if(shoot.shoot) this.addBullet(shoot.team, shoot.position, shoot.velocity);
        }
        return false;
    }
    
    
    this.addBullet = function (team, position, velocity) {
        var newBullet = new bullet(team, position, velocity);
        this.bullets[this.bullets.length] = newBullet;
    }
    
    this.addBase = function (team, position, size) {
        var newBase = new base(team, position, size);
        this.bases[this.bases.length] = newBase;
    }
    
    this.reset = function(){
        this.bullets = [];
        this.bases = [
            new base(0 ,{x: 1000, y: 1000},400),
            new base(1 ,{x: -1000, y: -1000},400),
            new base(2 ,{x: 1000, y: -1000},400),
            new base(3 ,{x: -1000, y: 1000},400),

            new base(-1 ,{x: 200, y: 200},300),
            new base(-1 ,{x: -200, y: -200},300),
            new base(-1 ,{x: -200, y: 200},300),
            new base(-1 ,{x: 200, y: -200},300),
        ];

        this.teams = [
            new team('P',0,'#e62d2d'),
            new team('O',1,'#ffce00'),
            new team('G',2,'#48f71e'),
            new team('I',3,'#1ebaff')
        ];
    }
    
    return false;
}