//自訂變數
var t=0;
var isJoin = false;
var mousepressed = false;
var coldTime = 5;
var updateSpeed = 3;
var lastPing = 0;
var messages = [];

function closing (){
    socket.emit('disconnect');
}

function setup() {
    canvas=createCanvas(innerWidth*0.98, innerHeight*0.87);
    canvas.parent('processing');
    //canvas.attribute("align", "center");
    frameRate(60);
}

function windowResized() {
    resizeCanvas(innerWidth*0.98, innerHeight*0.87);
}

function draw() {
    if(isJoin) {
        
        if(frameCount%3==0){
            updateData();
            if(players[myname].ping>lastPing+1&&updateSpeed+1<20) updateSpeed++;
            else if(players[myname].ping<lastPing-1&&updateSpeed-1>3) updateSpeed--;
            lastPing=players[myname].ping;
        }
        calc();
        render();
        fill(255);
        //text("mouse X = "+mouseX+"\n mouse Y = "+mouseY,20,20);
        if(players[myname]==undefined){
            fill(0,32);
            rect(0,0,width,height);
            text('AUTO LOGOUT',20,20);
        }
        coldTime--;
        if((mousepressed||presskey[32]) &&coldTime<0){
            if(myname=='火柴最神') coldTime=3;
            else coldTime=10;
            
            if(what==10){
                createBullet({
                    x: players[myname].position.x + Math.random()*players[myname].size*0.3,
                    y: players[myname].position.y + Math.random()*players[myname].size*0.3
                },{
                    x: dc({x:mouseX}).x,
                    y: dc({y:mouseY}).y
                }, 50);
                coldTime=5;
            }else{
                createBullet(players[myname].position,{
                    x: dc({x:mouseX}).x,
                    y: dc({y:mouseY}).y
                }, 40);
            }
            
        }
        textAlign(LEFT,BOTTOM);
        for(i in messages){
            
            textSize(20);
            fill(255);
            text(messages[messages.length-i-1],20,height-i*30-20);
            if(i>10) break;
        }
    }
}

function createBullet(from, to, speed){
    if(players[myname].numBullets>0){
        var dx = to.x - from.x;
        var dy = to.y - from.y;
        var dd = Math.sqrt(dx*dx+dy*dy);
        addBullet(
            {
                x: from.x + dx/dd * players[myname].size*0.6,
                y: from.y + dy/dd * players[myname].size*0.6
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
    /*if(isJoin){
        var dx = mouseX - c(players[myname].position).x;
        var dy = mouseY - c(players[myname].position).y;
        var dd = Math.sqrt(dx*dx+dy*dy);
        addBullet(
            {
                x: players[myname].position.x,
                y: players[myname].position.y
            },
            {
                x: dx/dd*20,
                y: dy/dd*20
            }
        );
    }
    */
}

function mouseReleased() {
    coldTime = 3;
    mousepressed = false;
}

function mouseWheel(event) {
    //event.delta can be +1 or -1 depending
    //on the wheel/scroll direction
    //move the square one pixel up or down
    if(0.1<camera.ts+event.delta*0.02&&camera.ts+event.delta*0.02<2)camera.ts+= event.delta*0.02;
    //uncomment to block page scrolling
    //return false;
}

function newlog(message){
    
    messages[messages.length]=message;
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
