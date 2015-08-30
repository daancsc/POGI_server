var teamLeaderBoard = [];
var awsomeBoardlist = [
    new awsomeBoard('最大尺寸!',innerWidth,innerHeight,1000,0),
    new awsomeBoard('最多佔領!',innerWidth,innerHeight,1000,0),
    new awsomeBoard('最強攻擊!',innerWidth,innerHeight,1000,0),
    new awsomeBoard('最高助援!',innerWidth,innerHeight,1000,0),
];

function scoreBoard(){
    scoreUpdate();
    awsomeUpdate();
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
    if(gameStatus=='final')hi=width*0.191;
    for(i in teamLeaderBoard){
        if(gameStatus=='final'){
            
            hi+=teamLeaderBoard[i].set(hi,height*0.191+45,width*0.1545-10,35);
            
        }else if(!isMobile) hi+=teamLeaderBoard[i].set(10,hi,140,35);
        else hi+=teamLeaderBoard[i].set(hi,10,innerWidth*0.2,35);
    }
    for(var i = teamLeaderBoard.length-1; i>=0; i--){
        teamLeaderBoard[i].display();
    }
}

function awsomeUpdate(){    
    awsomeBoardlist[0].update(gameScore.size);
    awsomeBoardlist[1].update(gameScore.capture);
    awsomeBoardlist[2].update(gameScore.attack);
    awsomeBoardlist[3].update(gameScore.help);
    
    var hi = height-45;
    if(gameStatus=='final')hi=width*0.191;
    
    for(i in awsomeBoardlist){
        if(gameStatus=='final'){
            
            hi+=awsomeBoardlist[i].set(hi,height*0.191+345,width*0.1545-10,35);
            
        }else if(!isMobile) hi-=awsomeBoardlist[i].set(width-110,hi,100,35);
        else hi+=awsomeBoardlist[i].set(hi,width+10,innerWidth*0.2,35);
    }
    for(var i = awsomeBoardlist.length-1; i>=0; i--){
        awsomeBoardlist[i].display();
    }
}

function teamSum(team){
    var sum = 0;
    for(i in bases)if(bases[i].team==team)sum+=bases[i].size;
    return Math.round(sum);
}

function scrollTeamLeaderBoard(delta){
    for(i in teamLeaderBoard){
        if(teamLeaderBoard[i].bigMode){
            teamLeaderBoard[i].scroll(delta);
        }
    }
    for(i in awsomeBoardlist){
        if(awsomeBoardlist[i].bigMode){
            awsomeBoardlist[i].scroll(delta);
        }
    }
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
    this.playersList = [];
    this.playerLength = 0;
    this.listOffset = 0;
    
    this.scoreX = 0;
    
    this.bigMode = false;
    
    this.colorWidth = 0.5;
    
    this.update = function(){
        this.score = teamSum(this.team);
        this.players = [];
        this.playerLength = 0;
        for(i in players){
            if(players[i].team == this.team){
                this.playerLength ++;
                this.playersList[this.playersList.length] = i;
            }
        }
    }
    this.set = function(x,y,w,h){
        this.tx = x;
        this.ty = y;
        this.tw = w;
        this.th = h;
        if(gameStatus=='final')return this.w+10;
        if(!isMobile)return this.h+10;
        else return this.w+10;
    }
    this.scroll = function(delta){
        if((this.x<mouseX&&mouseX<this.x+this.w&&this.y<mouseY&&mouseY<this.y+this.h)){
            var change = this.listOffset-delta*2;
            if(0<=change&&change+9<this.playerLength) this.listOffset = change;
        }
    }
    this.display = function(){
        if((this.x<mouseX&&mouseX<this.x+this.w&&this.y<mouseY&&mouseY<this.y+this.h)){
            if(gameStatus=='final'){
                this.bigMode = true;
            }else if(isMobile)this.w+=(innerWidth*0.25-this.w);
            else this.w+=(220-this.w);
            if(mousepressed&&!this.bigMode) this.bigMode = true;
        }else this.bigMode = false;
        
        if(this.team!=4||this.score>0){
            var bigHeight = Math.min(this.playerLength,10)*20+this.th*2+20;
            this.x+=(this.tx-this.x)*0.1;
            this.y+=(this.ty-this.y)*0.1;
            
            if(gameStatus=='final'){
                this.bigMode = true;
                //bigHeight = height*0.618;
                /*
                this.h+=(height*0.618-this.h)*0.4;
                this.colorWidth+=(1-this.colorWidth)*0.1;
                this.scoreX+=(0.5-this.scoreX)*0.2;*/
            }
            
            if(this.bigMode){
                if(gameStatus=='final'){
                    this.w+=((width*0.618-30)*0.25-this.w)*0.3;
                }else if(!isMobile)this.w+=(200-this.w)*0.3;
                else this.w+=(innerWidth*0.25-this.w)*0.3;
                this.h+=(bigHeight-this.h)*0.3;
                this.colorWidth+=(1-this.colorWidth)*0.1;
                this.scoreX+=(0.5-this.scoreX)*0.2;
            }else{
                this.w+=(this.tw-this.w)*0.3;
                this.h+=(this.th-this.h)*0.3;
                this.colorWidth+=(0.382-this.colorWidth)*0.1;
                this.scoreX+=(0.691-this.scoreX)*0.2;
            }
            var teamText = teams[this.team].name;
            var scoreText = this.score;
            
            if(this.bigMode){
                teamText = '基地'+teamText;
                scoreText = '積分'+scoreText;
            }
            
            
            noStroke();
            fill(0,32);
            rect(this.x-5,this.y-5,this.w+10,this.h+10);
            fill(255);
            rect(this.x,this.y,this.w,this.h);
            fill(teams[this.team].color);
            rect(this.x,this.y,this.w*this.colorWidth,this.th);
            noStroke();
            
            fill(255);
            textSize(24);
            textAlign(CENTER,CENTER);
            text(teamText,this.x+this.w*this.colorWidth*0.5,this.y+this.th*0.5);
            
            noStroke();
            fill(teams[this.team].color);
            fill(64);
            textSize(24);
            textAlign(CENTER,CENTER);
            text(scoreText,this.x+this.w*this.scoreX,this.y+this.th*((this.bigMode)?1.5:0.5));
            
            if(this.bigMode){
                var lines = 0;
                textSize(16);
                for(var i = 0;i<10&&i<this.playerLength;i++){
                    textAlign(LEFT,CENTER);
                    fill(0);
                    var playerText = nf(i+this.listOffset+1,2)+' '+usernames[this.playersList[i+this.listOffset]];
                    text(playerText,this.x+this.w*(this.colorWidth*0.1),this.y+this.th*2.5+lines*20);
                    textAlign(RIGHT,CENTER);
                    fill(64);
                    playerText = '?';
                    if(pplayers[this.playersList[i+this.listOffset]]!=undefined)
                        playerText=' '+Math.ceil(pplayers[this.playersList[i+this.listOffset]].size);
                    text(playerText,this.x+this.w*(this.colorWidth*0.9),this.y+this.th*2.5+lines*20);
                    lines++;
                }
            }
        }
        
        if(this.bigMode && this.playerLength>10){
            var h = Math.min(1,10/this.playerLength)*200;
            var y = this.listOffset/this.playerLength*200+this.y+70;

            stroke(64);
            strokeWeight(5);
            line(this.x+10,this.y+70,this.x+10,this.y+70+200);
            
            strokeWeight(5);
            stroke(200);
            line(this.x+10,y,this.x+10,(y+h));
        }
    }
}

function awsomeBoard(name,x,y,w,h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.tx = x;
    this.ty = y;
    this.tw = w;
    this.th = h;
    this.name = name;
    this.max = 0;
    this.list = [];
    
    this.listOffset = 0;
    
    this.maxX = 0;
    
    this.bigMode = false;
    
    this.colorWidth = 0.5;
    
    this.update = function(score){
        this.max = score.max;
        this.list = score.list;
    }
    
    this.set = function(x,y,w,h){
        this.tx = x;
        this.ty = y;
        this.tw = w;
        this.th = h;
        if(gameStatus=='final')return this.w+10;
        if(!isMobile)return this.h+10;
        else return this.w+10;
    }
    
    this.scroll = function(delta){
        if((this.x<mouseX&&mouseX<this.x+this.w&&this.y<mouseY&&mouseY<this.y+this.h)){
            var change = this.listOffset-delta*2;
            if(0<=change&&change+3<this.list.length) this.listOffset = change;
        }
    }
    
    this.display = function(){
        if((this.x<mouseX&&mouseX<this.x+this.w&&this.y<mouseY&&mouseY<this.y+this.h)){
            if(gameStatus=='final'){
                this.bigMode = true;
            }else if(isMobile)this.w+=(innerWidth*0.25-this.w);
            else {
                this.x+=(width-230-this.x)*0.3;
                this.w+=(220-this.w);
            }
            if(mousepressed&&!this.bigMode) this.bigMode = true;
        }else this.bigMode = false;
        
        if(true){
            var bigHeight = Math.min(this.list.length,10)*20+this.th*2+20;
            this.x+=(this.tx-this.x)*0.1;
            this.y+=(this.ty-this.y)*0.1;
            
            if(gameStatus=='final'){
                this.bigMode = true;
            }
            
            if(this.bigMode){
                if(gameStatus=='final'){
                    this.w+=((width*0.618-30)*0.25-this.w)*0.3;
                }else if(!isMobile){
                    this.x+=(width-210-this.x)*0.3;
                    this.w+=(200-this.w)*0.3;
                }
                else this.w+=(innerWidth*0.25-this.w)*0.3;
                if(gameStatus!='final')this.y+=(this.ty+10-bigHeight-this.y)*0.2;
                this.h+=(bigHeight-this.h)*0.3;
                this.colorWidth+=(1-this.colorWidth)*0.1;
                this.maxX+=(0.5-this.maxX)*0.2;
            }else{
                this.w+=(this.tw-this.w)*0.3;
                this.h+=(this.th-this.h)*0.3;
                this.colorWidth+=(0.7-this.colorWidth)*0.1;
                this.maxX+=(0.85-this.maxX)*0.2;
            }
            var title = this.name;
            var subt = this.max;
            
            
            noStroke();
            fill(0,32);
            rect(this.x-5,this.y-5,this.w+10,this.h+10);
            fill(255);
            rect(this.x,this.y,this.w,this.h);
            fill(255);
            rect(this.x,this.y,this.w*this.colorWidth,this.th);
            noStroke();
            
            fill(0);
            textSize(14);
            if(this.bigMode)textSize(24);
            textAlign(CENTER,CENTER);
            
            text(title,this.x+this.w*this.colorWidth*0.5,this.y+this.th*0.5);
            
            noStroke();
            fill(0);
            textSize(14);
            if(this.bigMode)textSize(16);
            textAlign(CENTER,CENTER);
            text(subt,this.x+this.w*this.maxX,this.y+this.th*((this.bigMode)?1.5:0.5));
            
            if(this.bigMode){
                var lines = 0;
                textSize(16);
                for(var i = 0;i<10&&i<this.list.length;i++){
                    textAlign(LEFT,CENTER);
                    var playerText = nf(i+this.listOffset+1,2)+' '+usernames[this.list[i+this.listOffset]];
                    text(playerText,this.x+this.w*(this.colorWidth*0.1),this.y+this.th*2.5+lines*20);
                    lines++;
                }
            }
            
            if(this.bigMode && this.list.length>10){
                var h = Math.min(1,10/this.list.length)*200;
                var y = this.listOffset/this.list.length*200+this.y+70;

                stroke(64);
                strokeWeight(5);
                line(this.x+10,this.y+70,this.x+10,this.y+70+200);

                strokeWeight(5);
                stroke(200);
                line(this.x+10,y,this.x+10,(y+h));
            }
        }
    }
}