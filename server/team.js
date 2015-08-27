

exports.team = function(name, id, color) {
    this.playernamesChanged = false;
    
    this.id = id;
    this.name = name;
    this.color = color;
    
    this.score = 0;
    this.playernames = {};
    
    this.join = function(player) {
        this.playernamesChanged = true;
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
    
    this.simData = function(){
        var simPlayernames = undefined;
        if(this.playernamesChanged)simPlayernames = this.playernames;
        this.playernamesChanged = false;
        return {
            name: this.name,
            playernames: simPlayernames
        };
    }
    
    
    return false;
}