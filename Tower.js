function Tower(range, targets)
{
    this.range = range;
    this.alive = true;
    this.targetCnt = targets.length;
    this.game = undefined;
    this.pos = 0;
}

Tower.prototype.selectTarget = function(targets)
{
    var theChosenOne = targets[0];
    var tower = this;
    targets.forEach(function(enemy) {
        if (enemy.alive && enemy.pos <= tower.range)
        {
            if (enemy.turnsTillWin < theChosenOne.turnsTillWin
                || enemy.pos - enemy.speed < theChosenOne.pos - theChosenOne.speed
                || theChosenOne.alive === false)
            {
                theChosenOne = enemy;
            }
        }
    });
    if (theChosenOne.alive === false || theChosenOne.pos > tower.range)
        return Promise.reject();
    else
        return Promise.resolve(theChosenOne);
}

Tower.prototype.killTarget = function(target)
{
    return target.die(this)
    .then(function(game) {
        if (game.silent === false)
            console.log('turn '+game.turn+': killed '+target.name+' at '+target.pos+'m');
        return Promise.resolve(target);
    });
}

Tower.prototype.attackEnemy = function(targets)
{
    return this.selectTarget(targets).then(this.killTarget.bind(this));
}

module.exports = Tower;