exports.player = function(name, team, position) {
    this.timeout = 200;
    this.name = name;
    this.team = team;
    this.position = position;
    this.velocity = {x:0, y:0};
    this.life = 100;
    this.size = 100;
    this.numBullets = 100;
    
    this.update = function(){
        this.timeout--;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        return false;
    }
    
    return false;
}