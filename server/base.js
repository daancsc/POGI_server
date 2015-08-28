var ids = 0;
var targets = [];
var ama = 2;

var worldWidth = 10000;
var worldHeight = 10000;




exports.base = function(team, position, size) {
    this.teamChanged = false;
    this.sizeChanged = false;
    this.positionChanged = false;
    this.velocityChanged = false;
    
    this.type = 'base';
    this.id = ids;ids=(ids+1)%200;
    this.team = team; this.teamChanged=true;
    this.position = position;
    this.velocity = {x:0, y:0};
    this.size = size;
    this.life = 100;
    this.coldTime = 100;
    this.foodTime = 500;
    this.border = false;
    this.lastSize = 100;
    
    this.update = function() {
        this.coldTime--;
        this.foodTime--;
        
        this.border = (this.size>=600);
        
        this.position.x += this.velocity.x*=0.9; this.positionChanged = true;
        this.position.y += this.velocity.y*=0.9;
        
        if(this.position.x<-worldWidth*0.5+this.size*0.6) {
            this.position.x = -worldWidth*0.5+this.size*0.6;
            this.velocity.x = 1; this.positionChanged = true; this.velocityChanged = true;
        }
        
        if(this.position.y<-worldHeight*0.5+this.size*0.6) {
            this.position.y = -worldHeight*0.5+this.size*0.6;
            this.velocity.y = 1; this.positionChanged = true; this.velocityChanged = true;
        }
        
        if(this.position.x>worldWidth*0.5-this.size*0.6) {
            this.position.x = worldWidth*0.5-this.size*0.6;
            this.velocity.x = -1; this.positionChanged = true; this.velocityChanged = true;
        }
        
        if(this.position.y>worldHeight*0.5-this.size*0.6) {
            this.position.y = worldHeight*0.5-this.size*0.6;
            this.velocity.y = -1; this.positionChanged = true; this.velocityChanged = true;
        }
        return false;
    }
    
    this.collide = function(object){
        var min = (object.size+this.size)*0.5;
        var distance = {
            x: object.position.x-this.position.x,
            y: object.position.y-this.position.y
        }
        if(Math.abs(distance.x)<min&&Math.abs(distance.y)<min){
            if((distance.x*distance.x+distance.y*distance.y)<min*min){
                var d = Math.sqrt(distance.x*distance.x+distance.y*distance.y);
                if(d>0){
                    var f = d - min;
                    this.velocity.x += f*distance.x/d*object.size/this.size*0.01;
                    this.velocity.y += f*distance.y/d*object.size/this.size*0.01;
                    this.velocityChanged = true;
                }
                if(object.type=='bullet'&&object.team!=-1){
                    object.life = 0;
                    this.addball(object);
                }
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
                this.coldTime = 200+(1000-this.size)*0.5;
                if(this.team==4){
                    this.coldTime= 20;
                    return {
                        shoot: true,
                        team: this.team,
                        position: {
                            x: this.position.x + dx/dd*this.size*0.6,
                            y: this.position.y + dy/dd*this.size*0.6
                        },
                        velocity:{
                            x: dx/dd*50,
                            y: dy/dd*50
                        }
                    }
                }else
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
            var min = this.size*2;
            if(this.team==4)size*=2;
            var distance = {
                x: object.position.x-this.position.x,
                y: object.position.y-this.position.y
            }
            if(Math.abs(distance.x)<this.size*2&&Math.abs(distance.y)<min){
                if((distance.x*distance.x+distance.y*distance.y)<min*min){
                    targets[targets.length] = object;
                    return true;
                }
            }
        }
        return false;
    }
    
    
    this.food = function(){
        
        if(this.foodTime<0){
            this.foodTime = 1000/this.size+200;
            return Math.floor(Math.sqrt(this.size)/3.5);
        }
        return 0;
    }
    
    this.addball = function(object){
        if(this.size<=100){ this.team = object.team; this.teamChanged=true;}
        if(object.team==this.team) {this.size+=object.size/5; this.sizeChanged=true; }
        else if(this.size>100){
            this.size-=object.size/5; this.sizeChanged=true; 
            if(this.size<=100){ this.team = -1; this.teamChanged=true;}
        }
    }
    
    
    this.simData = function (){
        var simTeam = undefined;
        var simSize = undefined;
        var simPosition = undefined;
        var simVelocity = undefined;
        if(Math.abs(this.lastSize-this.size)>10) this.sizeChanged = true;
        this.lastSize = this.size;
        if(this.coldTime%15!=0)this.positionChanged = this.velocityChanged;
        if(this.teamChanged) simTeam = this.team;
        if(this.sizeChanged)simSize = Math.round(this.size);
        if(this.positionChanged)simPosition = {
            x: Math.round(this.position.x),
            y: Math.round(this.position.y)
        };
        if(this.velocityChanged)simVelocity = {
            x: Math.round(this.velocity.x),
            y: Math.round(this.velocity.y)
        };
        this.teamChanged = false;
        this.sizeChanged =false;
        this.positionChanged = false;
        this.velocityChanged = false;     
        return {
            team: simTeam,
            size: simSize,
            position: simPosition,
            velocity: simVelocity,
            border: this.border,
            life: this.life
        };
    }
    
    return false;
}






