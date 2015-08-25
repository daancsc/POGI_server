//自訂變數
var t=0;
var isJoin = false;
var mousepressed = false;
var coldTime = 5;

var messages = [];

function closing (){
    socket.emit('disconnect');
}

function setup() {
    canvas=createCanvas(innerWidth*0.9, innerHeight*0.8);
    canvas.parent('processing');
    //canvas.attribute("align", "center");
    frameRate(60);
}

function draw() {
    if(isJoin) {
        if(frameCount%3==0){
            updateData();
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
        if(mousepressed &&coldTime<0){
            if(myname=='火柴最神') coldTime=3;
            else coldTime=8;
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
        textAlign(LEFT,BOTTOM);
        for(i in messages){
            
            textSize(20);
            fill(255);
            text(messages[messages.length-i-1],20,height-i*30-20);
            if(i>10) break;
        }
    }
}

function windowResized() {
    resizeCanvas(innerWidth*0.9, innerHeight*0.8);
}

function mousePressed() {
    mousepressed = true;
    if(isJoin){
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
}

function mouseReleased() {
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