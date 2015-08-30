var ctrlShoot = false;
var ctrlGoPoint = {x:0, y:0};
var ctrlShootPoint = {x:0, y:0};
var touched = false;
var twotouched = false;
var touchDist = 0;
var startZoom = 0;
var moving = false;
var touchPoint = {x:0,y:0};

function ctrlWay(){
    if(!isMobile){
        ctrlShoot = (mousepressed||presskey[32]);
        ctrlShootPoint = {
            x: dc({x: mouseX}).x,
            y: dc({y: mouseY}).y
        };
    }else{
        for(i in touches){
        }
        if(touches.length==1){
            ctrlShoot = false;
            if(!touched){
                touchPoint = touches[0];
            }else{
                var dx = touches[0].x-touchPoint.x;
                var dy = touches[0].y-touchPoint.y;
                var dd = Math.sqrt(dx*dx+dy*dy);
                if(dd>10){
                    ctrlGoPoint = {
                        x: dx*10/dd,
                        y: dy*10/dd
                    };
                    
                    moving = true;
                }
            }
            touched = true;
        }else if(touches.length==2){
            if(!moving){
                var dx = touches[0].x-touches[1].x;
                var dy = touches[0].y-touches[1].y;
                var dd = Math.sqrt(dx*dx+dy*dy);

                if(!twotouched){
                    touchDist = dd;
                    startZoom = camera.ts;
                }
                else{
                    zoom(startZoom*dd/touchDist);
                }
                twotouched = true;
            }else{
                var dx = touches[0].x-touchPoint.x;
                var dy = touches[0].y-touchPoint.y;
                var dd = Math.sqrt(dx*dx+dy*dy);
                if(dd>10){
                    ctrlGoPoint = {
                        x: dx*20/dd,
                        y: dy*20/dd
                    };
                    ctrlShootPoint = {
                        x: players[myid].position.x+dx,
                        y: players[myid].position.y+dy
                    };
                    moving = true;
                }
                ctrlShoot = true;
            }
            
            
            
        }else if(touches.length==0){
            touched = false;
            twotouched = false;
            moving = false;
            ctrlShoot = false;
            ctrlGoPoint.x*=0.6;
            ctrlGoPoint.y*=0.6;
            
        }
    }
}

function chatBox(){
    textAlign(LEFT,CENTER);
        
    if(showchat && messages.length>10){
        var h = Math.min(1,10/messages.length)*270;
        var y = height-chatOffset/messages.length*270-60;

        stroke(0);
        strokeWeight(5);
        line(10,height-60,10,height-330);

        stroke(255);
        line(10,y,10,(y-h));
    }


    for(var i = 0;i<10&&i<messages.length;i++){
        noStroke();
        textSize(16);

        if(showchat){
            fill(0,32);
            rect(20,height-i*30-71,300,28)
        }

        fill(255);
        var timeSub = t-messages[messages.length-i-1].time;

        if(timeSub<20)fill(255,timeSub*255/20);

        if(!showchat){
            if(timeSub>1600)fill(255,(2000-timeSub)*255/400);
            if(timeSub>=2000) noFill(); 
        }
        text(messages[messages.length-chatOffset-i-1].message,40,height-i*30-60);
    }
}

function gameBox(){
    if(frameCount%5==0){
        updateData();
        if(players[myid].ping>lastPing+1&&updateSpeed+1<20) updateSpeed++;
        else if(players[myid].ping<lastPing-1&&updateSpeed-1>3) updateSpeed--;
        lastPing=players[myid].ping;
    }

    refreshData();
    if(isJoin)calc();
    render();

    fill(255);
    
    coldTime--;
    if(ctrlShoot && coldTime<0 && players[myid].numBullets>0){
        cursorSize = 2;
        if(myid=='火柴最神') coldTime=5;
        else coldTime=8;

        if(what==10){
            createBullet(players[myid].position,ctrlShootPoint, 50);
            coldTime=3;
        }else{
            createBullet(players[myid].position,ctrlShootPoint, 40);
        }

    }else{
        cursorSize += (1-cursorSize)*0.3;
    }
}

function dcursor(){
    if(!isMobile){
        if(!showchat){
            strokeWeight(1);
            stroke(255);
            fill(0,16);
            ellipse(mouseX,mouseY,cs(pplayers[myid].size/cursorSize*0.5),cs(pplayers[myid].size/cursorSize*0.5));
        }else{
            strokeWeight(1);
            stroke(0,16);
            fill(255);
            ellipse(mouseX,mouseY,5,5);
        }
    }else{
        if(isJoin){
            
        }
        if(touched){
            fill(255,12);
            strokeWeight(1);
            stroke(255,64);
            ellipse(touchPoint.x,touchPoint.y,100,100);
            ellipse(touchPoint.x+ctrlGoPoint.x*3,touchPoint.y+ctrlGoPoint.y*3,25,25);
        }
    }
}


var timerPlace = {x:0,y:0,w:0,h:0};
var timerToPlace = {
        x: 0,
        y: 50,
        w: 280,
        h: 35
    };

function timer(){
    
    gameTimer-=0.9;
    smoothGameTimer+=(gameTimer-smoothGameTimer)*0.5;
    if(smoothGameTimer<0)smoothGameTimer = 0;
    var second = Math.floor(smoothGameTimer/60);
    var minute = Math.floor(second/60);

    gametime = nf(minute,2)+'：'+nf(second%60,2);

    noStroke();
    var gameStatusText = '';
    strokeWeight(3);
    switch(gameStatus){
        case 'play':
            gameStatusText = '對戰吧，佔領敵人的基地!  '+gametime;
            if(second<=60) gameStatusText = '最後 '+second+' 秒';
            if(second<=10){
                '倒數 '+second+' 秒!';
                if(second%2==0) stroke('#e83535');
            }
            timerToPlace.w= gameStatusText.length*16+20;
            timerToPlace.x= width-timerToPlace.w-20;
            timerToPlace.y= 50;
            break;
        case 'final':
            gameStatusText = '分數統計，你玩得怎樣呢? 下一場將在 '+second+' 秒後開始';
            timerToPlace.w= width*0.618;
            timerToPlace.x= width*0.192;
            timerToPlace.y= height*0.192;
            break;
        case 'ready':
            gameStatusText = '準備傳送並重新開始遊戲...  ' + second;
            timerToPlace.w= width;
            timerToPlace.x= 0;
            timerToPlace.y= height*0.5-35*0.5;
            break;
            
    }
    
    
    timerPlace.x += (timerToPlace.x-timerPlace.x)*0.2;
    timerPlace.y += (timerToPlace.y-timerPlace.y)*0.2;
    timerPlace.w += (timerToPlace.w-timerPlace.w)*0.2;
    timerPlace.h += (timerToPlace.h-timerPlace.h)*0.2;
    
    fill(255);
    
    rect(timerPlace.x,timerPlace.y,timerPlace.w,timerPlace.h);
    noStroke();
    textSize(16);
    textAlign(CENTER,CENTER);
    fill(0);
    text(gameStatusText,timerPlace.x+timerPlace.w*0.5,timerPlace.y+timerPlace.h*0.5);
}