//自訂變數
var t=0;
var isJoin = false;

function closing (){
    socket.emit('disconnect');
}

function setup() {
    canvas=createCanvas(innerWidth*0.9, innerHeight*0.9);
    canvas.parent('processing');
    //canvas.attribute("align", "center");
}

function draw() {
    if(isJoin) {
        if(frameCount%3==0){
            updateData();
        }
        calc();
        render();
        fill(255);
        text("mouse X = "+mouseX+"\n mouse Y = "+mouseY,20,20);
        if(players[myname].timeout<0){
            fill(0,32);
            rect(0,0,width,height);
            text('AUTO LOGOUT',20,20);
        }
    }
}

function windowResized() {
  resizeCanvas(innerWidth*0.9, innerHeight*0.9);
}