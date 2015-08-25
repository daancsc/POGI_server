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
    rect(c({x:-5000}).x,c({y:-5000}).y,cs(10000),cs(10000));
    
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
    
    textAlign(CENTER,CENTER);
    display(bases,bases);
    display(players,pplayers);
    display(bullets,pbullets);
    
    
}

function display(object,pobject){
    
    
    for(i in object){
        if(pobject[i]!=undefined&&pobject[i].position!=undefined){
            
            stroke(0,16); strokeWeight(cs(20));
            if(object[i].team!=-1) fill(teams[object[i].team].color);
            else fill(255);
            ellipse(c(pobject[i].position).x,c(pobject[i].position).y,cs(object[i].size),cs(object[i].size));
            
            noStroke();
            textSize(20);
            if(object[i].name!=undefined)
                text(object[i].name, c(pobject[i].position).x, c(pobject[i].position).y-cs(object[i].size)*0.75-10);
            
            textSize(cs(object[i].size*0.2));
            fill(255);
            if(object[i].coldTime!=undefined&&object[i].team!=undefined&&teams[object[i].team]!=undefined){
                text(teams[object[i].team].name,c(pobject[i].position).x,c(pobject[i].position).y);
                textSize(cs(object[i].size*0.1));
                text('\n\n'+object[i].size,c(pobject[i].position).x,c(pobject[i].position).y);
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

function cs(s){
    return s*camera.s;
}
var what = 0;
function keyPressed(){
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
    }
    console.log(keyCode+' '+what);
}