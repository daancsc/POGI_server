exports.team = function(name, id, color) {
    this.id = id;
    this.name = name;
    this.color = color;
    
    this.score = 0;
    this.playernames = {};
    
    this.join = function(player) {
        this.playernames[player.name] = player.name;
        return false;
    }
    
    this.numPlayers = function() {
        var out = 0;
        for(i in this.playernames){
            out++;
        }
        return out;
    }
    
    return false;
}

exports.hi = function() {
    console.log('hi');
    return false;
}