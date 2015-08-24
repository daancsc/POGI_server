function calc () {
    t+=0.01;
    for(i in players){
        if(players[i].timeout<0){
            delete player[i];
            delete pplayers[i];
            continue;
        }
        if(pplayers[i]!=undefined&&players[i]!=undefined){
            pplayers[i].position.x += (players[i].position.x-pplayers[i].position.x)*0.2;
            pplayers[i].position.y += (players[i].position.y-pplayers[i].position.y)*0.2;
        }else{
            if(players[i]!=undefined){
                pplayers[i]=players[i];
            }else delete pplayers[i];
        }
    }
}