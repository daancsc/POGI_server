
exports.AIBRAIN = function(){
    this.doingTime = 0;
    this.status = 'idle';
    this.gotoTargets = false;
    this.shootTargets = false;
    this.coldTime = 10;
    this.todo = {do:'idle',with:undefined};
    this.calc = function(me,game){
        this.doingTime--;
        this.coldTime--;
        var vel={x:0, y:0};
        var shoot=false;
        this.todo = whattodo(me, game);
        if(this.doingTime<0){
            this.doingTime=Math.random()*250+400;
            this.status = this.todo.do;
            switch(this.status){
                case 'idle':
                    this.gotoTargets = false;
                    this.shootTargets = false;
                    break;
                case 'help':
                    if(goto(me.position,this.todo.with.position).distence>this.todo.with.size*0.5+150)this.gotoTargets = this.todo.with;
                    else this.gotoTargets = undefined;
                    if(this.todo.with.size>600)  this.doingTime=0;
                    this.shootTargets = this.todo.with;
                    break;
                case 'attack':
                    if(goto(me.position,this.todo.with.position).distence>this.todo.with.size*0.5+200)this.gotoTargets = this.todo.with;
                    else this.gotoTargets = undefined;
                    if(this.todo.with.team == me.team||this.todo.with.size<70)  this.doingTime=0;
                    this.shootTargets = this.todo.with;
                    break;
                case 'eat':
                    if(goto(me.position,this.todo.with.position).distence<me.size*0.6) this.doingTime=0;
                    this.gotoTargets = this.todo.with;
                    this.shootTargets = false;
                    break;
            }
        }
        if(this.gotoTargets!=false&&this.gotoTargets!=undefined){
            vel = goto(me.position, this.gotoTargets.position, 8).velocity;
        }else vel = {x:0, y:0};
        if(this.coldTime<0&&this.shootTargets!=false&&this.shootTargets!=undefined){
            this.coldTime=10+Math.random()*10;
            var shootVelocity = goto(me.position,this.shootTargets.position, 40).velocity;
            shoot = {
                from: {
                    x: me.position.x + shootVelocity.x*me.size*0.6/40,
                    y: me.position.y + shootVelocity.y*me.size*0.6/40,
                },
                speed: shootVelocity
            };
        }
        return {
            velocity: vel,
            shoot: shoot
        }
    }
    return false;
}

var goto = function (from, to, speed){
    var dx = to.x - from.x;
    var dy = to.y - from.y;
    var dd = Math.sqrt(dx*dx+dy*dy);
    
    return {
        velocity: {
            x: dx*speed/dd,
            y: dy*speed/dd
        },
        distence: dd
    };
}

var whattodo =function (me, game){
    var thingtodo = 'idle';
    var withObject = undefined;
    var needEat = false;
    if(me.numBullets>60){
        
        var attackBase = findRandom(find('base', me.team, game, false),function(check){
            return (check.size<me.size*2);
        });
        if(attackBase != undefined){
            thingtodo = 'attack';
            withObject = attackBase;
            //console.log(me.name+'考慮攻擊基地'+attackBase.id);   
        }else needEat = true;
        
        var helpBase = findRandom(find('base', me.team, game, true),function(check){
            return (check.size<600);
        });
        if(me.size>200){
            helpBase = findMin(find('base', me.team, game, true),function(check){
                return (-check.size);
            });
        }
        if(helpBase != undefined){
            thingtodo = 'help';
            withObject = helpBase;
            //console.log(me.name+'考慮救援基地'+helpBase.id);  
        }
        if(Math.random()<0.9){
            var attackPlayer = findRandom(find('player', me.team, game, false),function(check){
                return (check.size<me.size);
            });
            if(attackPlayer != undefined){
                thingtodo = 'attack';
                withObject = attackPlayer;
                //console.log(me.name+'考慮攻擊基地'+attackBase.id);   
            }
        }
    }
    if(me.numBullets<=60||Math.random()<0.4||(needEat&&Math.random()<0.8)){
        var eatBall = findMin(find('bullet', -1, game, true),function(check){
            return goto(me.position, check.position, 1).distence;
        });
        if(eatBall != undefined){
            thingtodo = 'eat';
            withObject = eatBall;
        }
    }
    return {
        do: thingtodo,
        with: withObject
    }
}

var find= function (what, team, game, isMine){
    var array = [];
    var findlist = [];
    switch(what){
        case 'base': findlist = game.bases; break;
        case 'player': findlist = game.players; break;
        case 'bullet': findlist = game.bullets; break;
    }
    for(i in findlist){
        if( ((findlist[i].team==team)&&isMine) || ((findlist[i].team!=team)&&!isMine) ){
            array[array.length]=findlist[i];
        }
    }
    return array;
}

var findRandom= function (list, isThisRight){
    var rightList = [];
    for(i in list){
        if(isThisRight(list[i])) rightList[rightList.length]=list[i];
    }
    var i = Math.floor(Math.random()*rightList.length);
    return rightList[i];
}

var findMin =function (list, checkThis){
    var rightList = [];
    var min = Infinity;
    for(i in list){
        var value = checkThis(list[i]);
        if(value<=min){
            if(value<min) rightList = [];
            rightList[rightList.length] = list[i];
        }
    }
    var i = Math.floor(Math.random()*rightList.length);
    return rightList[i];
}