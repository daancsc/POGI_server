var worldWidth = 10000;
var worldHeight = 10000;



var ids = 0;
exports.bullet = function(team, position, velocity, life, size) {
    this.teamChanged = true;
    this.sizeChanged = true;
    this.positionChanged = true;
    this.velocityChanged = true;
    
    ids=(ids+1)%400;
    this.type = 'bullet';
    this.id = ids;
    this.team = team; this.teamChanged=true;
    this.position = position;
    this.velocity = velocity;
    this.size = size;
    this.life = life;
    
    this.update = function() {
        this.position.x += this.velocity.x; this.positionChanged = true;
        this.position.y += this.velocity.y;
        this.life-=1;
        
        if(this.position.x<-worldWidth*0.5+this.size*0.6) {
            this.position.x = -worldWidth*0.5+this.size*0.6;
            this.velocity.x = 1;
            this.changed = true; this.positionChanged = true; this.velocityChanged = true;
        }
        
        if(this.position.y<-worldHeight*0.5+this.size*0.6) {
            this.position.y = -worldHeight*0.5+this.size*0.6;
            this.velocity.y = 1;
            this.changed = true; this.positionChanged = true; this.velocityChanged = true;
        }
        
        if(this.position.x>worldWidth*0.5-this.size*0.6) {
            this.position.x = worldWidth*0.5-this.size*0.6;
            this.velocity.x = -1;
            this.changed = true; this.positionChanged = true; this.velocityChanged = true;
        }
        
        if(this.position.y>worldHeight*0.5-this.size*0.6) {
            this.position.y = worldHeight*0.5-this.size*0.6;
            this.velocity.y = -1; this.positionChanged = true; this.velocityChanged = true;
            this.changed = true;
        }
        if(this.team==-1&&this.size<20) {this.size+=1; this.sizeChanged = true; }
        if(this.life<20) {this.size=this.life; this.sizeChanged = true; }
        return false;
    }
    
    this.collide = function(object){
        var min = (object.size+this.size)*0.5;
        if(this.team==-1&&object.type=='player') min*=2;
        if(this.team!=-1&&object.type=='base'&&this.team!=object.team&&object.border) min+=300;
        var distance = {
            x: object.position.x-this.position.x,
            y: object.position.y-this.position.y
        }
        if(Math.abs(distance.x)<min&&Math.abs(distance.y)<min){
            if((distance.x*distance.x+distance.y*distance.y)<min*min){
                var d = Math.sqrt(distance.x*distance.x+distance.y*distance.y);
                if(this.team==-1&&object.type=='player'){
                    var f = 1;
                    this.velocity.x += f*distance.x/d; this.velocityChanged = true;
                    this.velocity.y += f*distance.y/d;
                    this.changed = true;
                }else if(d>0&&!(this.team!=-1&&object.type=='base'&&this.team!=object.team&&(object.border&&d<min-40&&this.life>150))){
                    var f = d - min;
                    this.velocity.x += f*distance.x/d; this.velocityChanged = true;
                    this.velocity.y += f*distance.y/d;
                    this.changed = true;
                }
                return true;
            }
            return false;
        }
        return false;
    }
    
    this.simData = function (){
        var simTeam = undefined;
        var simSize = undefined;
        var simPosition = undefined;
        var simVelocity = undefined;
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
            velocity: simVelocity
        };
    }
    
    return false;
}