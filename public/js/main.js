var socket = io();

var usernames = {}; //儲存現在有的所有user的name
var numUsers = 0;   //儲存有多少user

//自訂變數
var t=0;

function closing (){
    socket.emit('disconnect');
}

function setup() {
    createCanvas(displayWidth,displayHeight);
}

function draw() {
    calc();
    render();
}