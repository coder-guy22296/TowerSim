var Enemy = require('./Enemy.js')
var Tower = require('./Tower.js')
var TowerDefence = require('./TowerDefence.js')

function targetBadie(game)
{
    console.log('tb');
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
            tower.alive = false;
            // if (enemy.pos < 0 && enemy.pos < game.extraDistance)
            //     game.extraDistance = enemy.pos - 1;
            // console.log('enemy pos: '+enemy.pos);
            // console.log('new pos: '+(game.tower.pos + game.extraDistance)); 
            break;
        }
    }
    return Promise.resolve(game);
}

function gameLoop(game)
{
    console.log(game);
    return targetBadie(game)
    .then(moveBadies)
    .then(function(game) {
        console.log('tick over');
        if (game.tower.alive && game.tower.targetCnt > 0)
        {
            game.turn += 1;
            console.log('turn');
            return gameLoop(game);
        }
        else if (game.tower.alive)
            game.won = true;
        else
            game.won = false;
        return Promise.resolve(game);
    });
}

function startGame(game)
{
    return duplicateGame(game).then(gameLoop);
}

function findMinimumRange(game)
{
    return gameLoop(game);
}

function duplicateGame(game)
{
    function prepObjectForCopy(game) {
        game.tower.game = undefined;
        return Promise.resolve(game);
    }
    return prepObjectForCopy(game).then(function (game) {
        copy = JSON.parse(JSON.stringify(game))
        return Promise.resolve({game: game, copy: copy});
    }).then(function (params) {
        params.game.tower.game = params.game;
        params.copy.tower.game = params.copy;
        //console.log(copy);
        return Promise.resolve(copy);
    });
}

var badies = [];
//badies.push( new Enemy('dead', 5, 10) );
badies.push( new Enemy('bob', 50, 20) );
badies.push( new Enemy('bill', 100, 10) );
badies.push( new Enemy('mike', 30, 20) );
var tower = new Tower(50, badies);
var game = new TowerDefence(tower, badies);
for (var i = 0; i < badies.length; i++)
{
    var enemy = badies[i];
    enemy.calcTurnsTillRange(tower.range);
    //enemy.announce();
}
console.log('firing range: '+tower.range);
//var dup = duplicateGame(game);
// console.log(dup);
startGame(game)
.then(function(game) {
    //console.log(game);
    if (game.won === true)
        console.log('you won on turn '+game.turn);
    else
        console.log('you lost on turn '+game.turn);
});

//impossible
//if enemy count is greater than the highest turns till win, then the game will be a loss
//or
//