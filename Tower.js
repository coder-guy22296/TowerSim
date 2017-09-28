function Tower(range, targets)
{
    console.log('tower constructor start');
    this.range = range;
    this.alive = 1;
    this.targetCnt = targets.length;
    //console.log('tower constructor end');
    //console.log('this tower range: '+this.range);
}

Tower.prototype.selectTarget = function(targets)
{
    console.log('tower selectTarget start');
    //console.log('st this tower range: '+this.range);
    var theChosenOne = targets[0];
    var tower = this;
    targets.forEach(function(enemy) {
        // if the enemy is a viable target
        //console.log('foreach');
        //enemy.announce();
        if (enemy.alive && enemy.pos <= tower.range)
        {
            //console.log('viable')
            //console.log('tower range: '+tower.range);
            //get priorities straight
            if (enemy.turnsTillWin < theChosenOne.turnsTillWin)
            {
                theChosenOne = enemy;
                console.log('selected '+enemy.name+' for death');
            }
        }
    });
    //console.log('selection: '+theChosenOne);
    if (theChosenOne === undefined)
    {
        //console.log('reject promise');
        return Promise.reject();
    }
    else
    {
        //console.log('final selection: '+theChosenOne.name);
        return Promise.resolve(theChosenOne);
    }
}

Tower.prototype.killTarget = function(target)
{
    console.log('tower killTarget start');
    //console.log('the chosen one: '+target.name+target.alive);
    var parent = this;
    //console.log(this);
    console.log('killTarget: tower range: '+this.range);        // attackEnemy: tower range: undefined
    console.log('this target count: '+this.targetCnt);
    target.die(this);
}

function noTargetsAvailable()
{
    //console.log('this tower range: '+this.range);
    console.log('no targets to kill!');
}

Tower.prototype.attackEnemy = function(targets)
{
    console.log('tower attackEnemy start');
    console.log('attackEnemy: tower range: '+this.range);       // attackEnemy: tower range: 50 
    var parent = this;    
    this.selectTarget(targets).then(this.killTarget.bind(this), noTargetsAvailable);
    return Promise.resolve(targets);
}

module.exports = Tower;