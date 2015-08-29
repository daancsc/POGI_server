var teamLeaderBoard = [];

function scoreBoard(){
    scoreUpdate();
    return false;
}


function scoreUpdate(){
    for(i in teams){
        if(teamLeaderBoard[i]==undefined){
            teamLeaderBoard[i] = new teamBoard(i,i*-100,10,10,10);
        }
    }
    
    for(i in teamLeaderBoard){
        teamLeaderBoard[i].update();
    }
    
    teamLeaderBoard.sort(function(a,b){
        return b.score - a.score;
    })
    var hi = 10;
    for(i in teamLeaderBoard){
        hi+=teamLeaderBoard[i].set(10,hi,120,35);
    }
    for(var i = teamLeaderBoard.length-1; i>=0; i--){
        teamLeaderBoard[i].display();
    }
}

function teamSum(team){
    var sum = 0;
    for(i in bases)if(bases[i].team==team)sum+=bases[i].size;
    return Math.round(sum);
}

function teamBoard(team,x,y,w,h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.tx = x;
    this.ty = y;
    this.tw = w;
    this.th = h;
    this.team = team;
    this.score = 0;
    
    this.update = function(){
        this.score = teamSum(this.team);
    }
    this.set = function(x,y,w,h){
        this.tx = x;
        this.ty = y;
        this.tw = w;
        this.th = h;
        return this.h+10;
    }
    this.display = function(){
        if(this.score>0){
            this.x+=(this.tx-this.x)*0.1;
            this.y+=(this.ty-this.y)*0.1;
            this.w+=(this.tw-this.w)*0.1;
            this.h+=(this.th-this.h)*0.1;
            
            noStroke();
            fill(0,32);
            rect(this.x-5,this.y-5,this.w+10,this.h+10);
            fill(255);
            rect(this.x,this.y,this.w,this.h);
            fill(teams[this.team].color);
            rect(this.x,this.y,this.w*0.5,this.h);
            noStroke();
            
            fill(255);
            textSize(this.h*0.75);
            textAlign(CENTER,CENTER);
            text(teams[this.team].name,this.x+this.w*0.25,this.y+this.h*0.5);
            
            noStroke();
            fill(teams[this.team].color);
            fill(64);
            textSize(this.h*0.5);
            textAlign(CENTER,CENTER);
            text(this.score,this.x+this.w*0.75,this.y+this.h*0.5);
        }
    }
}