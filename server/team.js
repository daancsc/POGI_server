exports.function team (name, id, color) {
    this.id = id;
    this.name = name;
    this.color = color;
    
    this.numPlayer = 0;
    this.score = 0;
    this.playernames = {};
    
    function join (player) {
        ++numPlayer;
        playernames[player.name] = player.name;
    }
}