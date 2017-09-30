function TowerDefence(tower, badies)
{
    tower.game = this;
    this.tower = tower;
    this.badies = badies;
    this.turn = 1;
    this.extraDistance = 0;
    this.overtime = false;
    this.won = undefined;
}

module.exports = TowerDefence;