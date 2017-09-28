var Enemy = require('./Enemy.js')
var Tower = require('./Tower.js')
var TowerDefence = require('./TowerDefence.js')

function targetBadie(game)
{
    tower.attackEnemy(game.badies);
    return Promise.resolve(game);
}

function moveBadies(game)
{
    for (var i = 0; i < game.badies.length; i++)
    {
        var enemy = game.badies[i];
        enemy.move();
        if (enemy.pos <= 0)
        {
            tower.alive = 0;
            break;
        }
    }
    return Promise.resolve(game);
}

function gameLoop(game)
{
    targetBadie(game)
    .then(moveBadies)
    .then(function(game) {
        if (game.tower.alive && game.tower.targetCnt > 0)
        {
            game.turn += 1;
            gameLoop(game);
        }
        else
        {
            if (game.tower.alive)
                console.log('you won on turn '+game.turn);
            else
                console.log('you lost on turn '+game.turn);
        }
            //console.log(game);

    });
}

var badies = [];
badies.push( new Enemy('dead', 5, 10) );
badies.push( new Enemy('bob', 50, 20) );
badies.push( new Enemy('bill', 100, 10) );
badies.push( new Enemy('mike', 30, 20) );
var tower = new Tower(50, badies);
var game = new TowerDefence(tower, badies);
console.log('firing range: '+tower.range);
gameLoop(game);