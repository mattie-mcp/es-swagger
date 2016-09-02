#!/usr/bin/env node

var https = require('https');
var fs = require('fs');
var Promise = require('bluebird');
var yargs = require('yargs')
    .usage('usage: $0 [options]')
    .option('v', {
        alias: 'es-version',
        default: '2.3.0',
        demand: false,
        describe: 'elasticsearch version to use',
        type: 'string'
    })
    .help()
    .version()
    .strict();
var creds;

//Version of elasticsearch
var eVersion = yargs.argv.v;
var readFile = Promise.promisify(fs.readFile);
var options = {
    'host': 'api.github.com',
    'path': '/repos/elastic/elasticsearch/contents/rest-api-spec/src/main/resources/rest-api-spec/api?ref=v' + eVersion,
    'method': 'GET',
    'headers': {
        'user-agent': 'mattie-mcp',
        'Accept': 'application/vnd.github.v3+json'
    }
};
var apiActions = {};
//Connect to GitHub - Validate the API exists for the specific version
readFile('./.creds', 'utf8')
    .then(function (loadCreds) {
        creds = loadCreds;
        options.headers.Authorization = creds;
        //First request gets a list of API actions
        https.request(options, function (response) {
            var result = '';
            response.on('data', function (chunk) {
                result += chunk;
            });
            response.on('end', function () {
                var jTree = JSON.parse(result);
                console.log(jTree.length);
                for (var i = 0; i < jTree.length; i++) {
                    apiActions[jTree.name] = jTree.path;
                }
            });
        }).end();
    });
var apiMethods;

// function getCreds(){
//     readFile('./.creds', 'utf8')
//     .then(function (loadCreds) {
//         creds = loadCreds;
//         options.headers.Authorization = creds;
//         //First request gets a list of API actions
//         return new Promise((resolve, reject) => {

//         });
//     })
//     .then(function () {
//         console.log(JSON.stringify(apiActions));
//     });a
// };

// function getMethods(){

// };

//  function getApiMethod(i) {

// };

// function length() {
//     apiMethods = apiMethods || getMethods();
//     return apiMethods
// };

 //For the entire API
    //Using the Swagger API, convert each line to Swagger specs

//Overwrite file for specific Elasticsearch version in out - generate empy file