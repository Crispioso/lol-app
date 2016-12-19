var express = require('express');
var app = express();
var fetch = require('node-fetch');
var pukeySummonerId = 19299605;
var gaSummonerId = '';
var apiKey= 'RGAPI-8bea7053-d5c4-474a-86e7-de2065a4c1d1';
var currentGamePath = 'https://euw.api.pvp.net/observer-mode/rest/consumer/getSpectatorGameInfo/EUW1/' + pukeySummonerId + '?api_key=' + apiKey;
var championPath = 'https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion?api_key=' + apiKey;
var championStatsPath = 'https://euw.api.pvp.net/api/lol/euw/v1.3/stats/by-summoner/' + pukeySummonerId + '/ranked?season=SEASON2016&api_key=' + apiKey;
var data = {};
var champions = {};
var errorMessage = '';

app.set('view engine', 'ejs');

fetch(championPath).then(function(response) {
    return response.json();
}).then(function(response) {
    for (var champion in response.data) {
        if(!response.data.hasOwnProperty( champion )) continue;
        champions[response.data[champion].id] = response.data[champion];
    }
});

fetch(currentGamePath).then(function(response) {
    return response.json();
}).then(function(responseJSON) {

    if (responseJSON.status.status_code !== 200) {
        console.log('Warning: ' + responseJSON.status.status_code + ' response when getting current match data');
        errorMessage = "User isn't online at the moment";
        return;
    }

    data = (responseJSON.participants).find(function(object) {
        return object.summonerId == pukeySummonerId;
    });
});

fetch(championStatsPath).then(function(response) {
    return response.json();
}).then(function(responseJSON) {

});

app.get('/', function (req, res) {

    if (errorMessage.length > 0) {
        res.send(errorMessage);
        return;
    }

    res.send(champions[data.championId].name);
});

app.post('/getUserStats', function () {

});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});