
var worldWidth = 10000;
var worldHeight = 10000;
var keep;


exports.player = function(name, team, position, AI) {
    this.teamChanged = false;
    this.sizeChanged = false;
    this.positionChanged = false;
    this.velocityChanged = false;
    this.numBulletsChanged = false;
    this.lastNumBullets = 0;
    
    this.type = 'player';
    this.timeout = 0;
    this.name = name;
    this.team = team; this.teamChanged=true;
    this.position = position;
    this.velocity = {x:0, y:0};
    this.life = 100;
    this.size = 60;
    this.numBullets = 100;
    this.ping = 0;
    this.what = 0;
    this.AI = AI;
    //this.AIplayplay = new AIBRAIN();
    
    this.update = function(){       
        
        if(!this.AI)this.timeout++;
        this.position.x += this.velocity.x; this.positionChanged = true;
        this.position.y += this.velocity.y;
        
        if(this.position.x<-worldWidth*0.5+this.size*0.6) {
            this.position.x = -worldWidth*0.5+this.size*0.6;
            this.velocity.x = 1; this.velocityChanged = true;
        }
        
        if(this.position.y<-worldHeight*0.5+this.size*0.6) {
            this.position.y = -worldHeight*0.5+this.size*0.6;
            this.velocity.y = 1; this.velocityChanged = true;
        }
        
        if(this.position.x>worldWidth*0.5-this.size*0.6) {
            this.position.x = worldWidth*0.5-this.size*0.6;
            this.velocity.x = -1; this.velocityChanged = true;
        }
        
        if(this.position.y>worldHeight*0.5-this.size*0.6) {
            this.position.y = worldHeight*0.5-this.size*0.6;
            this.velocity.y = -1; this.velocityChanged = true;
        }
        this.size = this.numBullets + 60;
        
        if(this.what==10) {
            if(this.team!=4)keep = this.team;
            this.team=4; this.teamChanged=true;
            this.numBullets = 100;
        } else if(this.team==4) {this.team = keep; this.teamChanged=true;}
        
        this.velocity.x*=0.98;
        this.velocity.y*=0.98;
        return false;
    }
    
    this.collide = function(object){
        var bound = (object.size+this.size)*0.5;
        var min = (object.size+this.size)*0.5;
        var isBorder = (object.type=='base'&&object.border);
        if(isBorder) min+=300;
        var distance = {
            x: object.position.x-this.position.x,
            y: object.position.y-this.position.y
        }
        if(Math.abs(distance.x)<min&&Math.abs(distance.y)<min){
            if((distance.x*distance.x+distance.y*distance.y)<min*min){
                if(object.type=='bullet'){
                    if(object.team==-1){ this.numBullets+=object.size/4; sizeChanged=true; numBulletsChanged=true; }
                    else if(object.team==this.team&&object.life<180) {
                        this.numBullets+=1; this.sizeChanged=true; this.numBulletsChanged=true;
                        this.velocity.x += object.velocity.x/this.size*0.1*object.size; velocityChanged = true;
                        this.velocity.y += object.velocity.y/this.size*0.1*object.size;
                    }
                    else if(object.team!=this.team&&this.numBullets>0) {
                        this.numBullets-=object.size/4; this.sizeChanged=true; this.numBulletsChanged=true;
                        this.velocity.x += object.velocity.x/this.size*5*object.size; velocityChanged = true;
                        this.velocity.y += object.velocity.y/this.size*5*object.size;
                    }
                    if(!(object.team==this.team&&object.life>=180)) object.life = 0;
                }
                var d = Math.sqrt(distance.x*distance.x+distance.y*distance.y);
                if(d>0&&d<bound){
                    var f = d - bound;
                    this.velocity.x += f*distance.x/d*0.5; this.velocityChanged = true;
                    this.velocity.y += f*distance.y/d*0.5;
                }
                if(isBorder){
                    if(object.team==this.team){
                        
                    }
                    else{
                        this.velocity.x += distance.x/d*-0.2;
                        this.velocity.y += distance.y/d*-0.2;
                        this.velocityChanged=true;
                    }
                }
                return true;
            }
            return false;
        }
        return false;
    }
    
    this.setPing = function(){
        this.ping = this.timeout;
        return false;
    }
    
    
    this.simData = function(){
        var simTeam = undefined;
        var simSize = undefined;
        var simPosition = undefined;
        var simVelocity = undefined;
        var simNumBullets = undefined;
        if(this.teamChanged) simTeam = this.team;
        if(this.sizeChanged)simSize = Math.round(this.size);
        if(this.positionChanged)simPosition = {
            x: Math.round(this.position.x*5)/5,
            y: Math.round(this.position.y*5)/5
        };
        if(this.velocityChanged)simVelocity = {
            x: Math.round(this.velocity.x),
            y: Math.round(this.velocity.y)
        };
        if(this.numBulletsChanged||this.lastNumBullets!=this.numBullets){
            simSize = Math.round(this.size);
            simNumBullets = Math.round(this.numBullets);
        }
        this.teamChanged = false;
        this.sizeChanged =false;
        this.positionChanged = false;
        this.velocityChanged = false;
        this.numBulletsChanged = false;
        this.lastNumBullets = this.numBullets;
        return {
            team: simTeam,
            name: this.name,
            size: simSize,
            position: simPosition,
            velocity: simVelocity,
            numBullets: simNumBullets
        };
    }
    
    
    this.move = function (aisay){
        //var aisay = this.AIplayplay.calc(this,game);
        this.velocity.x = (this.velocity.x*4+aisay.velocity.x*2)/7;
        this.velocity.y = (this.velocity.y*4+aisay.velocity.y*2)/7;
        this.velocityChanged = true;
        return aisay;
    }
    return false;
}













