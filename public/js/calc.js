function calc () {
    camera.position.x += ((pplayers[myid].position.x*2+dc({x:mouseX}).x)/3 - camera.position.x)*0.2;
    camera.position.y += ((pplayers[myid].position.y*2+dc({y:mouseY}).y)/3 - camera.position.y)*0.2;
    camera.s += (camera.ts - camera.s) *0.2;
    if(!showchat){
        if(!isMobile){
            var dx = mouseX - c(players[myid].position).x;
            var dy = mouseY - c(players[myid].position).y;
            var dd = Math.sqrt(dx*dx+dy*dy);
            if(dd>200){
                pplayers[myid].velocity.x = (pplayers[myid].velocity.x+dx/dd*5)*0.75;
                pplayers[myid].velocity.y = (pplayers[myid].velocity.y+dy/dd*5)*0.75;
                if(what==10){
                    pplayers[myid].velocity.x += dx/dd*10;
                    pplayers[myid].velocity.y += dy/dd*10;
                }
            }else{
                pplayers[myid].velocity.x *= 0.8;
                pplayers[myid].velocity.y *= 0.8;
            }
        }else{
            console.log(ctrlGoPoint);
            pplayers[myid].velocity.x = ctrlGoPoint.x;
            pplayers[myid].velocity.y = ctrlGoPoint.y;
            
            pplayers[myid].velocity.x *= 0.8;
            pplayers[myid].velocity.y *= 0.8;
        }
        

        


        if(presskey[87]) pplayers[myid].velocity.y = (pplayers[myid].velocity.y-5)*0.75;
        if(presskey[83]) pplayers[myid].velocity.y = (pplayers[myid].velocity.y+5)*0.75;
        if(presskey[65]) pplayers[myid].velocity.x = (pplayers[myid].velocity.x-5)*0.75;
        if(presskey[68]) pplayers[myid].velocity.x = (pplayers[myid].velocity.x+5)*0.75;
    }
    pplayers[myid].velocity.x *= 0.99;
    pplayers[myid].velocity.y *= 0.99;
    
    animated(players,pplayers);
    animated(bullets,pbullets);
    animated(bases,pbases);
    
    for(i in players){
        if(i!=myid) collide(pplayers[myid],players[i]);
        
        for(j in bullets) if(bullets[j]!=null) collide(bullets[j],players[i]);
    }
    for(i in bases){
        if(bases[i].team!=players[myid].team) {collide(pplayers[myid],pbases[i]); collide(players[myid],pbases[i]);}
        for(j in bullets) if(bullets[j]!==null) collide(bullets[j],pbases[i]);
    }
    
}

var animated = function(object,pobject){
    
    for(i in object){
        if(object[i]!=undefined){
            if(object[i].life<=0){
                delete object[i];
                if(pobject[i]!=undefined)pobject[i].life = 0;
                continue;
            }else{
                if(pobject[i]==undefined||pobject[i].life<=0) {
                    pobject[i] = {
                        type: object[i].type,
                        life: object[i].life,
                        size: object[i].size,
                        position: object[i].position,
                        velocity: object[i].velocity
                    };
                }
                if(object[i]!=null&&
                    (
                        (i==myid&&object[i].type=='player')||t%100==0||
                        ( 
                            -500<    c({x: object[i].position.x+object[i].size }).x&& 
                            width+500> c({x: object[i].position.x-object[i].size }).x&& 
                            -500<    c({y: object[i].position.y+object[i].size }).y&& 
                            height+500>c({y: object[i].position.y-object[i].size }).y
                        )
                    )
                ){
                    movingUpdate(object[i]);
                    pobject[i].size += (object[i].size-pobject[i].size)*0.1;
                    if(ftm){
                        pobject[i].position.x += (object[i].position.x-pobject[i].position.x)*0.3;
                        pobject[i].position.y += (object[i].position.y-pobject[i].position.y)*0.3;
                    }else{
                        pobject[i].position.x += (object[i].position.x-pobject[i].position.x)*0.05;
                        pobject[i].position.y += (object[i].position.y-pobject[i].position.y)*0.05;
                    }
                    pobject[i].velocity.x += (object[i].velocity.x-pobject[i].velocity.x)*0.35;
                    pobject[i].velocity.y += (object[i].velocity.y-pobject[i].velocity.y)*0.35;

                    movingUpdate(pobject[i]);
                }
            }
        }else if(pobject[i]!=undefined)pobject[i].life = 0;;
        
    }
}

var movingUpdate = function(object){
    if(object.position.x<-worldWidth*0.5+object.size*0.5) {
        object.position.x = -worldWidth*0.5+object.size*0.5;
        object.velocity.x = 1;
    }

    if(object.position.y<-worldHeight*0.5+object.size*0.5) {
        object.position.y = -worldHeight*0.5+object.size*0.5;
        object.velocity.y = 1;
    }

    if(object.position.x>worldWidth*0.5-object.size*0.5) {
        object.position.x = worldWidth*0.5-object.size*0.5;
        object.velocity.x = -1;
    }

    if(object.position.y>worldHeight*0.5-object.size*0.5) {
        object.position.y = worldHeight*0.5-object.size*0.5;
        object.velocity.y = -1;
    }
    object.position.x += object.velocity.x;
    object.position.y += object.velocity.y;
    if(object.type!='bullet'){
        object.velocity.x*=0.98;
        object.velocity.y*=0.98;
    }
    
    return false;
}

var collide = function(player, object){    
    var min = (object.size+player.size)*0.5+10;
    var isBorder = false;
    if(player.type=='bullet'&&player.life<180&&object.type=='base'&&player.team!=-1&&player.team!=object.team&&object.border) {
        min+=300;
        isBorder = true;
    }
    var distance = {
        x: object.position.x-player.position.x,
        y: object.position.y-player.position.y
    }
    
    if(Math.abs(distance.x)<min&&Math.abs(distance.y)<min){
        if((distance.x*distance.x+distance.y*distance.y)<min*min){
            var d = Math.sqrt(distance.x*distance.x+distance.y*distance.y);
            if(player.type=='bullet'){
                if(player.size>0)player.size--;
                if(isBorder){
                    var f = d - min;
                    player.velocity.x += f*distance.x/d;
                    player.velocity.y += f*distance.y/d;
                }else{
                    player.velocity.x*=0.3;
                    player.velocity.y*=0.3;
                }
            }
            else if(d>0&&d<min){
                var f = d - min;
                if(f>5) f = 5;
                player.velocity.x += f*distance.x/d*0.3;
                player.velocity.y += f*distance.y/d*0.3;
            }
        }
    }
    return false;
}
