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
        if (enemy.pos <= game.tower.pos + game.extraDistance)
        {
            tower.alive = false;
            if (enemy.pos < 0 && enemy.pos < game.extraDistance)
                game.extraDistance = enemy.pos - 1;
            console.log('enemy pos: '+enemy.pos);
            console.log('new pos: '+(game.tower.pos + game.extraDistance)); 
            //break;
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
            else if (game.overtime && game.tower.targetCnt > 0)
            {
                gameLoop(game);
            }
            else if (game.overtime === false)
            {
                console.log('you lost on turn '+game.turn);
                game.overtime = true;
                gameLoop(game);
                
            }
            else
                {
                    console.log('firing range required to win: '+(game.tower.range+Math.abs(game.extraDistance)));
                }
        }
            //console.log(game);

    });
}

var badies = [];
badies.push( new Enemy('dead', 5, 10) );
badies.push( new Enemy('bob', 50, 20) );
badies.push( new Enemy('bill', 100, 10) );
badies.push( new Enemy('mike', 30, 20) );
var tower = new Tower(10, badies);
var game = new TowerDefence(tower, badies);
for (var i = 0; i < badies.length; i++)
{
    var enemy = badies[i];
    enemy.calcTurnsTillRange(tower.range);
    enemy.announce();
}
console.log('firing range: '+tower.range);
gameLoop(game);

//impossible
//if enemy count is greater than the highest turns till win, then the game will be a loss
//or
//