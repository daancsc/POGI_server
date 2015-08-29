//自訂變數
var t=0;
var isJoin = false;
var mousepressed = false;
var coldTime = 5;
var updateSpeed = 3;
var lastPing = 0;
var messages = [];
var monitorMode = false;

var cursorSize = 10;

var showchat = false;
var chatOffset = 0;

function closing (){
    socket.emit('disconnect');
}

function setup() {
    canvas=createCanvas(innerWidth, innerHeight);
    canvas.parent('processing');
    //canvas.attribute("align", "center");
    frameRate(60);
    textFont("微軟正黑體");
    noCursor();
}

function windowResized() {
    waitress = millis() + 2000;
    if (fullscreen()) {
        resizeCanvas(displayWidth, displayHeight);
//        viewfs.style.display = "none";
//        exitfs.style.display = "block";
    } else {
        resizeCanvas(innerWidth,innerHeight);
//        exitfs.style.display = "none";
//        viewfs.style.display = "block";
    }
    noCursor();
    background(0);
}

function draw() {
    textChanged();
    if(isJoin) {
        
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
        //text("mouse X = "+mouseX+"\n mouse Y = "+mouseY,20,20);
        if(players[myid]==undefined){
            fill(0,64);
            rect(0,0,width,height);
            text('AUTO LOGOUT',20,20);
        }
        coldTime--;
        if((mousepressed||presskey[32]) && coldTime<0 && players[myid].numBullets>0){
            cursorSize = 2;
            if(myid=='火柴最神') coldTime=3;
            else coldTime=2;
            
            if(what==10){
                createBullet({
                    x: players[myid].position.x + Math.random()*players[myid].size*0.3,
                    y: players[myid].position.y + Math.random()*players[myid].size*0.3
                },{
                    x: dc({x:mouseX}).x,
                    y: dc({y:mouseY}).y
                }, 50);
                coldTime=5;
            }else{
                createBullet(players[myid].position,{
                    x: dc({x:mouseX}).x,
                    y: dc({y:mouseY}).y
                }, 40);
            }
            
        }else{
            cursorSize += (1-cursorSize)*0.3;
        }
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
        
        if(monitorMode)monitor();
        scoreBoard();
        t++;
        
        
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
    }
}

function createBullet(from, to, speed){
    if(players[myid].numBullets>0){
        var dx = to.x - from.x;
        var dy = to.y - from.y;
        var dd = Math.sqrt(dx*dx+dy*dy);
        addBullet(
            {
                x: from.x + dx/dd * players[myid].size*0.6,
                y: from.y + dy/dd * players[myid].size*0.6
            },
            {
                x: dx/dd*speed,
                y: dy/dd*speed
            }
        );
    }
    return false;
}



function mousePressed() {
    mousepressed = true;
}

function mouseReleased() {
    coldTime = 3;
    mousepressed = false;
}

function mouseWheel(event) {
    //event.delta can be +1 or -1 depending
    //on the wheel/scroll direction
    //move the square one pixel up or down
    if(showchat){
        var change = chatOffset+event.delta;
        if(0<=change&&change+10<=messages.length) chatOffset = change;
    }else if(0.1<camera.ts+event.delta*0.02&&camera.ts+event.delta*0.02<2)camera.ts+= event.delta*0.02;
    //uncomment to block page scrolling
    //return false;
}

function newlog(message){
    
    messages[messages.length]={
        time: t,
        message: message
    }
    return false;
}



/***********************************************
* Disable select-text script- © Dynamic Drive (www.dynamicdrive.com)
* This notice MUST stay intact for legal use
* Visit http://www.dynamicdrive.com/ for full source code
***********************************************/

//form tags to omit in NS6+:
var omitformtags=["input", "textarea", "select"]

omitformtags=omitformtags.join("|")

function disableselect(e){
    if (omitformtags.indexOf(e.target.tagName.toLowerCase())==-1)
    return false
}

function reEnable(){
    return true
}

if (typeof document.onselectstart!="undefined")
    document.onselectstart=new Function ("return false")
else{
    document.onmousedown=disableselect
    document.onmouseup=reEnable
}
