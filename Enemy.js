function Enemy(name, pos, speed)
{
    this.name = name;
    this.pos = pos;
    this.speed = speed;
    this.turnsTillWin = Math.ceil(pos / speed);
    this.alive = 1;
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
    console.log('['+this.name+']im at pos: '+this.pos+' alive: '+this.alive);
};

Enemy.prototype.die = function(attacker)
{
    if (this.alive && this.pos <= attacker.range)
    {   
        this.alive = 0;
        attacker.targetCnt -= 1;
        return Promise.resolve();
    }
    else
        return Promise.reject();
};

module.exports = Enemy;