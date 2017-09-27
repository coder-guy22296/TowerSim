var Enemy = require('./Enemy.js')
var Tower = require('./Tower.js')
var TowerDefence = require('./TowerDefence.js')

function targetBadie(game)
{
    console.log('tb this tower range: '+game.tower.range);
    console.log('badies: '+game.badies);
    tower.attackEnemy(game.badies);
    console.log('badies: '+game.badies);
    return Promise.resolve(game);
}

function moveBadies(game)
{
    console.log('mb this tower range: '+game.tower.range);
    console.log('badies.lenght'+game.badies);
    for (var i = 0; i < game.badies.length; i++)
    {
        var enemy = game.badies[i];
        enemy.move();
        enemy.announce();
        if (enemy.pos <= 0)
        {
            console.log(enemy.name+' killed tower at '+enemy.pos);
            tower.alive = 0;
            console.log('tower dead');
            break;
        }
    }
    console.log('move badies done');
    return Promise.resolve(game);
}

function gameLoop(turn, game)
{
    console.log('turn '+turn);
    console.log('this tower range: '+game.tower.range);
    console.log('this target count: '+game.tower.targetCnt);
    turn += 1;
    targetBadie(game)
    .then(moveBadies)
    .then(function(game) {
        console.log('tower range: '+game.tower.range);
        console.log('tower targets: '+game.tower.targetCnt);
        console.log('tower alive: '+game.tower.alive);
        if (game.tower.alive && game.tower.targetCnt > 0)
            gameLoop(turn, game);
    });
}

var badies = [];
//badies.push( new Enemy('dead', 5, 10) );
badies.push( new Enemy('bill', 100, 10) );
badies.push( new Enemy('mike', 30, 5)   );
badies.push( new Enemy('bob', 50, 5)   );
var tower = new Tower(50, badies);
var game = new TowerDefence(tower, badies);
console.log('tower: '+tower.targetCnt);
console.log('GAME START!!');
gameLoop(1, game);