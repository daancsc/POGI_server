var monitor_player = [];
var monitor_bullet = [];
var monitor_base = [];

function monitor(){
    if(t%5==0) monitorUpdate();
    var keepW = 200;
    keepW += drawSingleMonitor('player',monitor_player,keepW,10,50)+10;
    keepW += drawSingleMonitor('bullet',monitor_bullet,keepW,25,50)+10;
    keepW += drawSingleMonitor('base',monitor_base,    keepW,40,50)+10;
    displayme(name,keepW,55);
}

function displayme(name,x,y){
    var ttext = '';
    if(players[myid]!=undefined){
        ttext += 'velX='+players[myid].velocity.x+'\n';
        ttext += 'velY='+players[myid].velocity.y+'\n';
        ttext += 'preVelX='+ pplayers[myid].velocity.x +'\n';
        ttext += 'preVelY='+ pplayers[myid].velocity.y +'\n';
        ttext += '='+  +'\n';
        ttext += '='+  +'\n';
        ttext += '='+  +'\n';
    }
    fill(255);
    noStroke();
    text(ttext,x,y);
}

function drawSingleMonitor(name,list,x,y,mh){
    noStroke();
    fill(255,64);
    rect(x,y,Math.floor(list.length/mh)*10+10,mh*3+30)
    
    fill(255);
    textSize(8);
    textAlign(LEFT,TOP);
    text(name,x,y);
    strokeWeight(1);
    for(i in list){
        switch(list[i]){
            case 0:
                stroke(255);
                break;
            case 1:
                stroke(0,255,0);
                break;
            case 2:
                stroke(0,0,255);
                break;
            case 3:
                stroke(255,255,0);
                break;
            case 4:
                stroke(255,0,0);
                break;
                
        }
        
        line(x+Math.floor(i/mh)*10,y+(i%mh)*3+20,x+Math.floor(i/mh)*10+8,y+(i%mh)*3+20);
    }
    return Math.floor(list.length/mh)*10+10;
}

function monitorUpdate(){
    for(i in pplayers){
        var sta = 1;
        if(players[i]!=undefined){
            if(players[i].ping>10) sta = 3;
            if(players[i].ping>20) sta = 4;
            if(players[i].ping>30) sta = 5;
        }
        monitor_player[i] = sta;
    }
    /*
    for(i in pbullets){
        var sta = 0;
        if(bullets[i]!=null) sta++;
        if(pbullets[i]!=undefined) {
            sta++;
            if(pbullets[i].life<=20) sta = 3;
            if(pbullets[i].life<=0) sta = 0;
        }
        monitor_bullet[i] = sta;
    }
    for(i in pbases){
        var sta = 0;
        if(bases[i]!=null) sta++;
        if(pbases[i]!=undefined) sta++;
        monitor_base[i] = sta;
    }*/
}