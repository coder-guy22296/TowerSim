function Enemy(name, pos, speed)
{
    console.log('enemy constructor start');
    this.name = name;
    this.pos = pos;
    this.speed = speed;
    this.turnsTillWin = Math.ceil(pos / speed);
    //console.log(name + ' will win in ' + this.turnsTillWin +' moves');
    this.alive = 1;
}

Enemy.prototype.move = function()
{
    console.log('enemy move start');
    if (this.alive)
    {
        this.pos -= this.speed;
        //console.log(this.name+' has moved');
    }
};

Enemy.prototype.announce = function()
{
    console.log('['+this.name+']im at pos: '+this.pos+' alive: '+this.alive);
};

Enemy.prototype.die = function(attacker)
{
    console.log('enemy die start');
    this.announce();
    console.log('attacker range: '+attacker.range);
    if (this.alive && this.pos <= attacker.range)
    {   
        this.alive = 0;
        console.log('Kill ' + this.name
                   + ' at ' + this.pos
                   + 'm');
        attacker.targetCnt -= 1;
    }
    else
        console.error('kill failed!!!');
};

module.exports = Enemy;