var ids = 0;
var targets = [];
var ama = 2;

var worldWidth = 10000;
var worldHeight = 10000;
exports.base = function(team, position, size) {
    ids++;
    this.id = ids;
    this.team = team;
    this.position = position;
    this.velocity = {x:0, y:0};
    this.size = size;
    this.life = 100;
    this.coldTime = 100;
    
    this.update = function() {
        this.coldTime--;
        this.position.x += this.velocity.x*=0.9;
        this.position.y += this.velocity.y*=0.9;
        
        if(this.position.x<-worldWidth*0.5+this.size*0.6) {
            this.position.x = -worldWidth*0.5+this.size*0.6;
            this.velocity.x = 1;
        }
        
        if(this.position.y<-worldHeight*0.5+this.size*0.6) {
            this.position.y = -worldHeight*0.5+this.size*0.6;
            this.velocity.y = 1;
        }
        
        if(this.position.x>worldWidth*0.5-this.size*0.6) {
            this.position.x = worldWidth*0.5-this.size*0.6;
            this.velocity.x = -1;
        }
        
        if(this.position.y>worldHeight*0.5-this.size*0.6) {
            this.position.y = worldHeight*0.5-this.size*0.6;
            this.velocity.y = -1;
        }
        return false;
    }
    
    this.collide = function(object){
        var distance = {
            x: object.position.x-this.position.x,
            y: object.position.y-this.position.y
        }
        if(Math.abs(distance.x)<object.size*0.5+this.size*0.5&&Math.abs(distance.y)<object.size*0.5+this.size*0.5){
            if((distance.x*distance.x+distance.y*distance.y)<object.size*object.size*0.25+this.size*this.size*0.25){
                var d = Math.sqrt(distance.x*distance.x+distance.y*distance.y);
                var f = d - object.size*0.5 - this.size*0.5;
                this.velocity.x += f*distance.x/d*object.size/this.size*0.01;
                this.velocity.y += f*distance.y/d*object.size/this.size*0.01;
                object.life = 0;
                this.addball(object.team);
                return true;
            }
            return false;
        }
        return false;
    }
    this.clearTargets = function(){
        targets = [];
        return false;
    }
    
    this.Target = function(){
        return targets[Math.floor(Math.random()*targets.length)];
    }
    
    this.shoot = function(){
        if(this.team==-1) return {shoot: false};
        if(this.coldTime<0&&targets!=undefined){
            var target = this.Target();
            if(target!=undefined){
                var dx= target.position.x-this.position.x;
                var dy= target.position.y-this.position.y;
                var dd= Math.sqrt(dx*dx+dy*dy);
                this.coldTime = 100+2000/this.size;
                return {
                    shoot: true,
                    team: this.team,
                    position: {
                        x: this.position.x + dx/dd*this.size*0.6,
                        y: this.position.y + dy/dd*this.size*0.6
                    },
                    velocity:{
                        x: dx/dd*5,
                        y: dy/dd*5
                    }
                }
            }
        }
        return {shoot: false};
        
    }
    this.findTarget = function(object){
        if(Object.team!=this.team){
            var distance = {
                x: object.position.x-this.position.x,
                y: object.position.y-this.position.y
            }
            if(Math.abs(distance.x)<this.size*2&&Math.abs(distance.y)<this.size*2){
                if((distance.x*distance.x+distance.y*distance.y)<this.size*this.size*2*2){
                    
                    targets[targets.length] = object;
                    return true;
                }
            }
        }
        return false;
    }
    
    this.addball = function(team){
        if(this.size<=100) this.team = team;
        if(team==this.team) this.size+=ama;
        else if(this.size>100){
            this.size-=ama;
            if(this.size<=100) this.team = -1;
        }
    }
    return false;
}