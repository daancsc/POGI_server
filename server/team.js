exports.team = function(name, id, color) {
    this.idsChanged = true;
    
    this.id = id;
    this.name = name;
    this.color = color;
    
    this.score = 0;
    this.ids = [];
    
    this.join = function(data) {
        this.idsChanged = true;
        this.ids[this.ids.length] = data.id;
        return false;
    }
    
    this.numIds = function() {
        return this.ids.length;
    }
    
    this.simData = function(){
        var simIds = undefined;
        if(this.idsChanged)simIds = this.ids;
        this.idsChanged = false;
        return {
            id: this.id,
            ids: simIds
        };
    }
    
    
    return false;
}