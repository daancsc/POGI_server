function render () {
    background(0);
    fill(255);
    for(i in players){
        if(dplayers[i].position!=undefined&&players[i].name!=undefined){
            text(players[i].name,dplayers[i].position.x,dplayers[i].position.y-10);
            ellipse(dplayers[i].position.x,dplayers[i].position.y,20,20);
        }
    }
}