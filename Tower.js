function Tower(range, targets)
{
    this.range = range;
    this.alive = 1;
    this.targetCnt = targets.length;
    this.game = undefined;
}

Tower.prototype.selectTarget = function(targets)
{
    var theChosenOne = targets[0];
    var tower = this;
    targets.forEach(function(enemy) {
        // if the enemy is a viable target
        if (enemy.alive && enemy.pos <= tower.range)
        {
            //compare to the current target if the current target is alive
            if (enemy.turnsTillWin < theChosenOne.turnsTillWin || theChosenOne.alive === 0)
            {
                theChosenOne = enemy;
            }
        }
    });
    if (theChosenOne.alive === 0 || theChosenOne.pos > tower.range)
    {
        return Promise.reject();
    }
    else
    {
        return Promise.resolve(theChosenOne);
    }
}

Tower.prototype.killTarget = function(target)
{
    var currentTurn = this.game.turn;
    target.die(this)
    .then(function() {
        console.log('turn '+currentTurn+': killed '+target.name+' at '+target.pos+'m');
    }, function() {

    });
}

function noTargetsAvailable()
{
    //console.log('no targets to kill!');
}

Tower.prototype.attackEnemy = function(targets)
{
    var parent = this;    
    this.selectTarget(targets).then(this.killTarget.bind(this), noTargetsAvailable);
    return Promise.resolve(targets);
}

module.exports = Tower;