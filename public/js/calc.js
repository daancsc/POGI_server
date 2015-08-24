function calc () {
    t+=0.01;
    for(i in players){
        if(dplayers[i]!=undefined&&players[i]!=undefined&&dplayers[i].name==players[i].name){
            dplayers[i].position.x += (players[i].position.x-dplayers[i].position.x)*0.2;
            dplayers[i].position.y += (players[i].position.y-dplayers[i].position.y)*0.2;
        }else{
            if(players[i]!=undefined){
                dplayers[i]=players[i];
            }else delete dplayers[i];
        }
    }
}