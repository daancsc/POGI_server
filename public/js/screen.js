function checkserAgent(){
var userAgentInfo=navigator.userAgent;
var userAgentKeywords=new Array('Android', 'iPhone' ,'SymbianOS', 'Windows Phone', 'iPad', 'iPod', 'MQQBrowser');
var flag=false;
if(userAgentInfo.indexOf('Windows NT')==-1){
    flag=true;
}
    return flag;
}
if(checkserAgent()){
    //document.location.href='http://cynet.tw/mobile/';
}

function fullButton(){
    if(width-100<mouseX&&mouseX<width-20&&20<mouseY&&mouseY<100){
        
    }
}