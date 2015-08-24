var socket = io();

var usernames = {}; //儲存現在有的所有user的name
var numUsers = 0;   //儲存有多少user
var myname = '';

function named () {
    var text = document.getElementById('name');
    socket.emit('add user',text.value);
    text.value = '';
}