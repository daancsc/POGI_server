var worldWidth = 10000;
var worldHeight = 10000;

var ids = 0;
exports.bullet = function(team, position, velocity) {
    ids=(ids+1)%1000;
    this.id = ids;
    this.team = team;
    this.position = position;
    this.velocity = velocity;
    this.size = 20;
    this.life = 200;
    
    this.update = function() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.life-=1;
        
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
                this.velocity.x += f*distance.x/d;
                this.velocity.y += f*distance.y/d;
                return true;
            }
            return false;
        }
        return false;
    }
    return false;
}