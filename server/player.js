exports.player = function(name, team, position) {
    this.timeout = 200;
    this.name = name;
    this.team = team;
    this.position = {x: position.x,y: position.y};
    this.velocity = {x:0, y:20};
    this.life = 100;
    this.size = 100;
    this.numBullets = 100;
    
    this.update = function(){
        this.timeout--;
        this.position += this.velosity;
        return false;
    }
    
    return false;
}