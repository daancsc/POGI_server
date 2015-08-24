function render () {
    background(0);
    fill(255);
    for(i in players){
        if(pplayers[i].position!=undefined){
            fill(teams[players[i].team].color);
            //console.log(players[i].name,players[i].position.x,players[i].position.y);
            text(teams[players[i].team].name+" "+players[i].name,pplayers[i].position.x-20,pplayers[i].position.y-10);
            ellipse(pplayers[i].position.x,pplayers[i].position.y,20,20);
        }
    }
}