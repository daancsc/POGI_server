function calc () {
    t+=0.01;
    camera.position.x += (players[myname].position.x - camera.position.x)*0.05;
    camera.position.y += (players[myname].position.y - camera.position.y)*0.05;
    camera.s += (camera.ts - camera.s) *0.05;
    
    var dx = mouseX - c(players[myname].position).x;
    var dy = mouseY - c(players[myname].position).y;
    var dd = Math.sqrt(dx*dx+dy*dy);
    if(dd>cs(100)+100){
        players[myname].velocity.x = dx/dd*3;
        players[myname].velocity.y = dy/dd*3;
        if(what==10){
            players[myname].velocity.x += dx/dd*20;
            players[myname].velocity.y += dy/dd*20;
        }
    }else{
        players[myname].velocity.x *= 0.9;
        players[myname].velocity.y *= 0.9;
    }
    
    
    for(i in players){
        if(players[i].timeout<0){
            delete player[i];
            delete pplayers[i];
            continue;
        }
        if(pplayers[i]!=undefined&&players[i]!=undefined){
            pplayers[i].position.x += (players[i].position.x-pplayers[i].position.x)*0.2;
            pplayers[i].position.y += (players[i].position.y-pplayers[i].position.y)*0.2;
            players[i]=movingUpdate(players[i]);
        }else{
            if(players[i]!=undefined){
                pplayers[i]=players[i];
            }else delete pplayers[i];
        }
    }
    for(i in bullets){
        if(bullets[i]!=undefined&&bullets[i].life<0){
            delete bullets[i];
            delete pbullets[i];
            continue;
        }
        if(pbullets[i]!=undefined&&bullets[i]!=undefined){
            pbullets[i].position.x += (bullets[i].position.x-pbullets[i].position.x)*0.2;
            pbullets[i].position.y += (bullets[i].position.y-pbullets[i].position.y)*0.2;
            bullets[i]=movingUpdate(bullets[i]);
        }else{
            if(bullets[i]!=undefined){
                pbullets[i]=bullets[i];
            }else delete pbullets[i];
        }
    }
}

var movingUpdate = function(player){
    player.position.x += player.velocity.x;
    player.position.y += player.velocity.y;
    return player;
}