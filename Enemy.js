function Enemy(name, pos, speed)
{
    this.name = name;
    this.pos = pos;
    this.speed = speed;
    this.turnsTillWin = Math.ceil(pos / speed);
    this.turnsTillRange = -42;
    this.turnsInRange = -42;
    this.alive = true;
}

Enemy.prototype.calcTurnsTillRange = function(range)
{
    this.turnsTillRange = Math.ceil((this.pos - range) / this.speed);
    if (this.pos < range)
        this.turnsInRange = this.turnsTillWin;
    else
        this.turnsInRange = Math.floor(range / this.speed);
}

Enemy.prototype.move = function()
{
    if (this.alive)
    {
        this.pos -= this.speed;
        this.turnsTillWin -= 1;
    }
};

Enemy.prototype.announce = function()
{
    console.log(this);
};

Enemy.prototype.die = function(attacker)
{
    if (this.alive && this.pos <= attacker.range)
    {   
        this.alive = false;
        attacker.targetCnt -= 1;
        return Promise.resolve(attacker.game);
    }
    else
        return Promise.reject();
};

module.exports = Enemy;