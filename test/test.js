const should = require('should')
const mocha = require('mocha')
const TowerDefence = require('../TowerDefence')
const Enemy = require('../Enemy')
const Tower = require('../Tower')

describe('Enemy', function() {
    var enemy = new Enemy('botA', 60, 10);
    var tower = new Tower(50, []);

    describe('Movement', function() {
        it('tries to move dead enemy', function() {
            var originalPos = enemy.pos;
            enemy.alive = false;
            enemy.move();
            (enemy.pos).should.equal(originalPos);
        });
        it('move an alive enemy', function() {
            enemy.alive = true;
            var originalPos = enemy.pos;
            enemy.move();
            (enemy.pos).should.equal(originalPos - enemy.speed);

        });
    });
    describe('Death', function() {
        it('enemy lives when attacker is out of range', function() {
            enemy.pos = 60;
            tower.range = 50;
            enemy.die(tower);
            (enemy.alive).should.equal(true);
        });
        it('attacker kills the enemy while in range', function() {
            enemy.move();
            enemy.die(tower);
            (enemy.alive).should.equal(false);
        });
        it('attacker tries to kill a dead enemy', function() {
            enemy.die(tower);
            (enemy.alive).should.equal(false);
        });
    });
});

describe('Tower', function() {
    var badies = [];
    var target = undefined;
    badies.push( new Enemy('botA', 100, 10) );
    badies.push( new Enemy('botC', 30, 20) );
    badies.push( new Enemy('botB', 50, 20) );
    var tower = new Tower(50, badies);
    var game = new TowerDefence(tower, badies);
    game.silent = true;
    describe('Target Selection', function() {
        it('selects highest priority target', function() {
            return tower.selectTarget(badies).then(function (selected) {
                target = selected;
                (selected.name).should.equal('botC');
            });
        });
    });
    describe('Target Destruction', function() {
        it('successfully kills target', function() {
            tower.killTarget(target);
            (target.alive).should.equal(false);
        });
    });
    describe('Select and Kill', function() {
        it('successfully selects and kills the target', function() {
            return tower.attackEnemy(badies)
            .then(function(target) {
                (target.name).should.equal('botB');
                (target.alive).should.equal(false);
            });
            
        });
    });
});