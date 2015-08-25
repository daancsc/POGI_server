var worldWidth = 10000;
var worldHeight = 10000;

exports.player = function(name, team, position) {
    this.timeout = 200;
    this.name = name;
    this.team = team;
    this.position = position;
    this.velocity = {x:0, y:0};
    this.life = 100;
    this.size = 60;
    this.numBullets = 100;
    
    
    this.update = function(){      
        this.timeout--;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
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
                this.velocity.x += f*distance.x/d*0.1;
                this.velocity.y += f*distance.y/d*0.1;
                return true;
            }
            return false;
        }
        return false;
    }
    
    
    return false;
}