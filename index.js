var lodash = require('lodash')
var Enemy = require('./Enemy.js')
var Tower = require('./Tower.js')
var TowerDefence = require('./TowerDefence.js')

function targetBadie(game)
{
    game.tower.attackEnemy(game.badies);
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
            game.tower.alive = false;
            break;
        }
    }
    return Promise.resolve(game);
}

function gameLoop(game)
{
    return targetBadie(game)
    .then(moveBadies)
    .then(function(game) {
        if (game.tower.alive && game.tower.targetCnt > 0)
        {
            game.turn += 1;
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
function setMaxRange(game)
{
    var maxRange = -1;
    for (var i = 0; i < game.badies.length; i++)
    {
        if (game.badies[i].pos > maxRange)
            maxRange = game.badies[i].pos;
    }
    game.tower.range = maxRange;
    if (game.tower.range > 0)
        return Promise.resolve(game);
    else
        console.log('get rekt');
}

function silenceGame(game)
{
    game.silent = true;
    return Promise.resolve(game);
}

function isWinPossible(game)
{
    return duplicateGame(game).then(setMaxRange).then(silenceGame).then(gameLoop);
}
function findMinimumRange(game, min, max)
{
    if (game.game)
    {
        min = game.min;
        max = game.max;
        game = game.game;
    }
    game.tower.range = Math.round(max - ((max - min) / 2));
    return silenceGame(game).then(startGame).then(function(game) {
        if (game.won)
        {
            console.log('range: '+game.tower.range+'m win');
            if (min === game.tower.range || max === game.tower.range)
                return Promise.resolve(game.tower.range);
            else
                return findMinimumRange(originalGame, min, game.tower.range);
        }
        else if (game.won === false)
        {
            console.log('range: '+game.tower.range+'m loss');
            return findMinimumRange(originalGame, game.tower.range, max);
        }
        else
            console.error('this should not happen!!');
    });
}

function duplicateGame(game)
{
    function prepObjectForCopy(game) {
        game.tower.game = 'temp';
        return Promise.resolve(game);
    }
    return prepObjectForCopy(game).then(function (game) {
        var copy = lodash.cloneDeep(game);
        return Promise.resolve({game: game, copy: copy});
    }).then(function (params) {
        params.game.tower.game = params.game;
        params.copy.tower.game = params.copy;
        params.copy.original = false;
        return Promise.resolve(params.copy);
    });
}

var badies = [];
badies.push( new Enemy('dead', 5, 10) );
badies.push( new Enemy('botA', 60, 10) );
badies.push( new Enemy('botB', 60, 10) );
badies.push( new Enemy('botC', 60, 10) );
badies.push( new Enemy('botD', 60, 10) );
badies.push( new Enemy('botE', 60, 10) );
badies.push( new Enemy('botF', 60, 10) );
badies.push( new Enemy('bob', 60, 10) );
badies.push( new Enemy('bill', 100, 10) );
badies.push( new Enemy('mike', 30, 20) );
var tower = new Tower(50, badies);
var originalGame = new TowerDefence(tower, badies);
for (var i = 0; i < badies.length; i++)
{
    var enemy = badies[i];
    enemy.calcTurnsTillRange(tower.range);
}
console.log('firing range: '+tower.range+'m');
startGame(originalGame)
.then(function(game) {
    if (game.won === true)
    {
        console.log('you won on turn '+game.turn);
        return Promise.reject();
    }
    else
    {
        console.log('you lost on turn '+game.turn);
        return Promise.resolve(originalGame);
    }
})
.then(isWinPossible, function() { return Promise.reject(); })
.then(function(game) {
    if (game.won)
        return Promise.resolve({
            game: originalGame,
            min: originalGame.tower.range,
            max: game.tower.range
        });
    else
    {
        console.log('This game is impossible to win!');
        return Promise.reject();
    }
})
.then(findMinimumRange, function(err) { return Promise.reject(); })
.then(function(minRangeToWin) {
    console.log('minimum range to win: '+minRangeToWin+'m');
}, function() { });
