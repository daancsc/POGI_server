var worldWidth = 10000;
var worldHeight = 10000;



var camera = {
    position: {
        x: 0,
        y: 0,
    },
    s: 0.2,
    ts: 0.6
}

function render () {
    textAlign(CENTER,CENTER);
    background(64); 
    noStroke();
    fill(32);
    rect(c({x:-worldWidth*0.5}).x,c({y:-worldHeight*0.5}).y,cs(worldWidth),cs(worldHeight));
    
    fill(70);
    textSize(cs(1000));
    text('POGI',c({x:0}).x,c({y:0}).y);
    
    textAlign(CENTER,TOP);
    textSize(cs(70));
    text('This is a great game call POGI !\n'+
         '>> use your mouse to move\n'+
         'hold or click to shot!!\n\n'+
         '大安高工電腦研究社\n'+
         'DACSC\n'+
         '2018/08/25\n'+
         '                          -by 火柴\n\n'+
         '現在時間：'+year()+'/'+month()+'/'+day()+'\n'+hour()+'：'+minute()+'：'+second(),c({x:0}).x,c({y:500}).y);
    
    textAlign(CENTER,BOTTOM);
    textSize(cs(100));
    text('在這充滿色彩的爭奪戰，\n'+
         '取得大球的占有權吧!!',c({x:0}).x,c({y:-600}).y);
    
    if(players[myid]!=undefined){
        textAlign(CENTER,CENTER);
        textSize(cs(100));
        text('PING伺服器差值：\n'+
             players[myid].ping,c({x:2000}).x,c({y:0}).y);
        text('PING伺服器差值：\n'+
             players[myid].ping,c({x:-2000}).x,c({y:0}).y);
    }
    
    display(bases,pbases);
    display(players,pplayers);
    display(bullets,pbullets);
    
}

function display(object,pobject){
    
    
    for(i in object){
        if(object[i]!=null&&
            0<    c({x: object[i].position.x+object[i].size*0.5 }).x&& 
           width> c({x: object[i].position.x-object[i].size*0.5 }).x&& 
            0<    c({y: object[i].position.y+object[i].size*0.5 }).y&& 
           height>c({y: object[i].position.y-object[i].size*0.5 }).y){
            if(pobject[i]!=undefined&&pobject[i].position!=undefined&&pobject[i].life>0){


                if(object[i].type=='base'&&object[i].border){
                    fill(0,16); stroke(teams[object[i].team].color); strokeWeight(1);
                    ellipse(c(pobject[i].position).x,c(pobject[i].position).y,cs(pobject[i].size+600),cs(pobject[i].size+600));
                }

                stroke(0,16); strokeWeight(cs(20));
                if(object[i].team!=-1) fill(teams[object[i].team].color);
                else fill(255);
                ellipse(c(pobject[i].position).x,c(pobject[i].position).y,cs(pobject[i].size),cs(pobject[i].size));

                noStroke();

                textSize(cs(object[i].size*0.4));
                fill(255);
                if(object[i].type=='base'&&object[i].team!=undefined&&teams[object[i].team]!=undefined){
                    text(teams[object[i].team].name,c(pobject[i].position).x,c(pobject[i].position).y);
                    textSize(cs(object[i].size*0.1));
                    text(Math.round(object[i].size-100),c(pobject[i].position).x,c(pobject[i].position).y+cs(object[i].size*0.3));
                }
                textSize(cs(object[i].size*0.4));
                if(object[i].type=='player'){
                    text(usernames[i], c(pobject[i].position).x, c(pobject[i].position).y);
                    textSize(cs(object[i].size*0.05));
                    text(Math.round(pobject[i].size-60),c(pobject[i].position).x,c(pobject[i].position).y+cs(object[i].size*0.3));
                }

                if(monitorMode){
                    stroke(0,255,0);
                    strokeWeight(1);
                    fill(0,64);
                    ellipse(c(object[i].position).x,c(object[i].position).y,cs(object[i].size),cs(object[i].size));
                    line(c(object[i].position).x,c(object[i].position).y,
                        c({x:object[i].position.x+object[i].velocity.x*10}).x,
                        c({y:object[i].position.y+object[i].velocity.y*10}).y);
                }
            }
        }
    }
}

function c(position){
    return {
        x: (position.x-camera.position.x)*camera.s+width*0.5,
        y: (position.y-camera.position.y)*camera.s+height*0.5
    };
}

function dc(position){
    return {
        x: (position.x-width*0.5)/camera.s+camera.position.x,
        y: (position.y-height*0.5)/camera.s+camera.position.y
    };
}

function cs(s){
    return s*camera.s;
}

var what = 0;
var presskey =[];
function keyPressed(){
    presskey[keyCode] = true;
    switch(keyCode){
        case UP_ARROW:
            if(what==0) what = 1;
            else if(what==1) what = 2;
            else what = 0;
            break;
        case DOWN_ARROW:
            if(what==2) what = 3;
            else if(what==3) what = 4;
            else what = 0;
            break;
        case LEFT_ARROW:
            if(what==4) what = 5;
            else if(what==6) what = 7;
            else what = 0;
            break;
        case RIGHT_ARROW:
            if(what==5) what = 6;
            else if(what==7) what = 8;
            else what = 0;
            break;
        case 66:
            if(what==8) what = 9;
            else what = 0;
            break;
        case 65:
            if(what==9) what = 10;
            else what = 0;
            break;
        case 79:
            monitorMode = !monitorMode;
            
    }
    console.log(keyCode+' '+what);
}

function keyReleased(){
    presskey[keyCode] = false;
}