var isMobile = false;

function checkMobile(){
    /*
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
        isMobile = true;
        alert('行動裝置版本仍在開發當中，\n請注意安全! 後果本單位不負責');
        //document.location.href='http://cynet.tw/mobile/';
    }*/
    function checkserAgent(){
    
    var flag=false;

    if(navigator.userAgent.match(/Android|iPhone|iPad/i)) {
       flag=true;
     }
	
        return flag;
    }
    if(checkserAgent()){        
        isMobile = true;
        alert('行動裝置版本仍在開發當中，\n請注意安全! 後果本單位不負責');
        //document.location.href='http://cynet.tw/mobile/';
    }
}

