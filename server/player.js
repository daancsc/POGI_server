exports.function player (name, team, position) {
    this.name = name;
    this.team = team;
    this.position = position;
    this.velocity = {x:0, y:0};
    this.life = 100;
    this.size = 100;
    this.numBullets = 100;
}