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
        var out = this.playernames.length;
        if(out == undefined) return 0;
        return out;
    }
    
    return false;
}

exports.hi = function() {
    console.log('hi');
    return false;
}