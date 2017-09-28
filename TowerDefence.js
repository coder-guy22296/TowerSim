function TowerDefence(tower, badies)
{
    tower.game = this;
    this.tower = tower;
    this.badies = badies;
    this.turn = 1;
}

module.exports = TowerDefence;