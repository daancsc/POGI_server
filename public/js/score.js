var teamLeaderBoard = [];

function scoreBoard(){
    scoreUpdate();
    return false;
}


function scoreUpdate(){
    for(i in teams){
        if(teamLeaderBoard[i]==undefined){
            teamLeaderBoard[i] = new teamBoard(i,10*i*i*-200,10,10,10);
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
        if(i==0)
            hi+=teamLeaderBoard[i].set(10,hi,80,50);
        else if(i==1)
            hi+=teamLeaderBoard[i].set(10,hi,80,40);
        else
            hi+=teamLeaderBoard[i].set(10,hi,80,30);
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
        return h+10;
    }
    this.display = function(){
        if(this.score>0){
            this.x+=(this.tx-this.x)*0.2;
            this.y+=(this.ty-this.y)*0.2;
            this.w+=(this.tw-this.w)*0.2;
            this.h+=(this.th-this.h)*0.2;
            strokeWeight(4);
            stroke(0,32);
            fill(teams[this.team].color);
            rect(this.x,this.y,this.w,this.h);
            strokeWeight(1);
            stroke(0,64);
            fill(255);
            textAlign(CENTER,CENTER);
            textSize(this.h*0.75);
            text(this.score,this.x+this.w*0.5,this.y+this.h*0.5);
        }
    }
}