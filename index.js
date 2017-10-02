const lodash = require('lodash')
const Enemy = require('./Enemy.js')
const Tower = require('./Tower.js')
const TowerDefence = require('./TowerDefence.js')
const gameFile = require('./sampleGame');
const fs = require('fs')
const readline = require('readline');

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

function startGame(game)
{
    console.log('firing range: '+game.tower.range+'m');
    return duplicateGame(game).then(gameLoop);
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
        console.error('Tower range is negative!?');
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
            console.log('testing range: '+game.tower.range+'m win');
            if (min === game.tower.range || max === game.tower.range)
                return Promise.resolve(game.tower.range);
            else
                return findMinimumRange(originalGame, min, game.tower.range);
        }
        else if (game.won === false)
        {
            console.log('testing range: '+game.tower.range+'m loss');
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

function loadGameFromJSONFile(file)
{
    for (var i = 0; i < file.targets.length; i++)
    {
        var target = file.targets[i];
        badies.push(new Enemy(target.name, target.pos, target.speed));
    }
    tower = new Tower(file.range, badies);
    originalGame = new TowerDefence(tower, badies);
    return Promise.resolve(originalGame);
}

function loadGameFromTextFile(filename)
{
    function strip(str, char) {
        return parseInt((str.split(char))[0]);
    }
    var range = -1;
    var counter = 0;
    var contents = fs.readFileSync(filename, 'utf8');
    var lines = contents.split('\n');
    range = strip(lines[0], 'm');
    for (var i = 1; i < lines.length; i++)
    {
        var line = lines[i];
        var arr = lines[i].split(' ');
        badies.push(new Enemy(arr[0], strip(arr[1], 'm'), strip(arr[2], 'm')));
    }
    tower = new Tower(range, badies);
    originalGame = new TowerDefence(tower, badies);
    return Promise.resolve(originalGame);
}

var badies = [];
var tower = undefined;
var originalGame = undefined;
var filename = undefined;

if (process.argv[2] === undefined)
{
    console.log('defaulting to sample game file: game.txt')
    filename = 'game.txt'
}
else
    filename = process.argv[2];
//loadGameFromJSONFile(filename) //use this one for json filesno
loadGameFromTextFile(filename)
.then(startGame)
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
