var socket = io();

var usernames = {}; //儲存現在有的所有user的name
var numUsers = 0;   //儲存有多少user

//自訂變數
var t=0;

function closing (){
    socket.emit('disconnect');
}

function setup() {
    createCanvas(1000,600);
}

function draw() {
    calc();
    render();
    fill(255);
    text("mouse X = "+mouseX+"\n mouse Y = "+mouseY,20,20);
}