function Enemy(name, pos, speed)
{
    this.name = name;
    this.pos = pos;
    this.speed = speed;
    this.turnsTillWin = Math.ceil(pos / speed);
    this.alive = true;
}

Enemy.prototype.move = function()
{
    if (this.alive)
    {
        this.pos -= this.speed;
        this.turnsTillWin -= 1;
    }
};

Enemy.prototype.die = function(attacker)
{
    if (this.alive && this.pos <= attacker.range)
    {   
        this.alive = false;
        attacker.targetCnt -= 1;
        return Promise.resolve(attacker.game);
    }
};

module.exports = Enemy;