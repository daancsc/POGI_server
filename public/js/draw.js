var camera = {
    position: {
        x: 0,
        y: 0,
    },
    s: 0.2,
    ts: 1
}

function render () {
    textAlign(CENTER,CENTER);
    background(32); noStroke();
    fill(32);
    rect(c({x:-10000}).x,c({y:-10000}).y,cs(20000),cs(20000));
    fill(70);
    textSize(cs(1000));
    text('POGI',c({x:0}).x,c({y:0}).y);
    
    textAlign(CENTER,TOP);
    textSize(cs(70));
    text('This is a great game call POGI !\n'+
         '>> use your mouse to move\n'+
         'hold or click to shot!!\n\n'+
         'Be happy with this game!\n\n'+
         '大安高工電腦研究社\n'+
         'DACSC\n'+
         '2018/08/25\n'+
         'by -強大的美宣-火柴',c({x:0}).x,c({y:500}).y);
    
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
            if(object[i].coldTime!=undefined&&object[i].team!=undefined&&teams[object[i].team]!=undefined)
                text(teams[object[i].team].name,c(pobject[i].position).x,c(pobject[i].position).y);
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