function calc () {
    t+=0.01;
    camera.position.x += ((players[myname].position.x*2+dc({x:mouseX}).x)/3 - camera.position.x)*0.05;
    camera.position.y += ((players[myname].position.y*2+dc({y:mouseY}).y)/3 - camera.position.y)*0.05;
    camera.s += (camera.ts - camera.s) *0.05;
    
    var dx = mouseX - c(players[myname].position).x;
    var dy = mouseY - c(players[myname].position).y;
    var dd = Math.sqrt(dx*dx+dy*dy);
    
    if(dd>100){
        players[myname].velocity.x = (players[myname].velocity.x+dx/dd*5)*0.75;
        players[myname].velocity.y = (players[myname].velocity.y+dy/dd*5)*0.75;
        if(what==10){
            players[myname].velocity.x += dx/dd*10;
            players[myname].velocity.y += dy/dd*10;
        }
    }else{
        players[myname].velocity.x *= 0.8;
        players[myname].velocity.y *= 0.8;
    }
    
    
    if(presskey[87]) players[myname].velocity.y = (players[myname].velocity.y-5)*0.75;
    if(presskey[83]) players[myname].velocity.y = (players[myname].velocity.y+5)*0.75;
    if(presskey[65]) players[myname].velocity.x = (players[myname].velocity.x-5)*0.75;
    if(presskey[68]) players[myname].velocity.x = (players[myname].velocity.x+5)*0.75;
    
    players[myname].velocity.x *= 0.98;
    players[myname].velocity.y *= 0.98;
    
    animated(players,pplayers);
    animated(bullets,pbullets);
    animated(bases,pbases);
}

var animated = function(object,pobject){
    for(i in object){
        if(object[i]!=undefined&&((object.type=='bullet'&&object[i].life<0)||(object.type=='player'&&object[i].timeout<0))){
            delete object[i];
            delete pobject[i];
            continue;
        }
        if(pobject[i]!=undefined&&object[i]!=undefined){
            movingUpdate(object[i]);
            pobject[i].size += Math.floor((object[i].size-pobject[i].size)*0.2);
            pobject[i].position.x += (object[i].position.x-pobject[i].position.x)*0.2;
            pobject[i].position.y += (object[i].position.y-pobject[i].position.y)*0.2;
        }else{
            if(object[i]!=undefined){
                pobject[i]=object[i];
            }else delete pobject[i];
        }
    }
}


var movingUpdate = function(player){
    player.position.x += player.velocity.x;
    player.position.y += player.velocity.y;
    if(player.type!='bullet'){
        player.velocity.x*=0.98;
        player.velocity.y*=0.98;
    }
    return player;
}