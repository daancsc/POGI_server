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

var smoothGameTimer = 0;
var gametime = '';


function closing (){
    socket.emit('disconnect');
}

function setup() {
    checkMobile();
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
        if(isMobile) resizeCanvas(innerWidth,innerHeight);
        else resizeCanvas(displayWidth, displayHeight);
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
        
        t++;
        
        ctrlWay();
        
        gameBox();
        
        chatBox();
        
        if(monitorMode)monitor();
        
        scoreBoard();
        
        dcursor();
        
        timer();
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
    if(isMobile){
        if(isJoin&&!showchat)fullscreen(true);
    }
}

function mouseReleased() {
    coldTime = 3;
    mousepressed = false;
}

function mouseWheel(event) {
    //event.delta can be +1 or -1 depending
    //on the wheel/scroll direction
    //move the square one pixel up or down
    scrollTeamLeaderBoard(event.delta);
    if(showchat){
        var change = chatOffset+event.delta;
        if(0<=change&&change+10<=messages.length) chatOffset = change;
    }else zoom(camera.ts+event.delta*0.02);
    //uncomment to block page scrolling
    //return false;
}

function zoom(change){
    if(0.1<=change&&change<=2)camera.ts= change;
    else if(0.1>change) camera.ts= 0.1;
    else if(change<2) camera.ts= 2;
}


function newlog(message){
    
    messages[messages.length]={
        time: t,
        message: message
    }
    return false;
}

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
