#!/usr/bin/env node

var https = require('https');
var fs = require('fs');
var Promise = require('promise');
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

//Version of elasticsearch
var eVersion = yargs.argv.v;

var readFile = Promise.denodeify(fs.readFile);

//Overwrite file for specific Elasticsearch version in out - generate empy file

//Connect to GitHub - Validate the API exists for the specific version
//Get API root
readFile('./.creds', 'utf8').then(function (creds) {
    var options = {
        'host': 'api.github.com',
        'path': 'https://api.github.com/repos/elastic/elasticsearch/git/trees/v' + eVersion,
        'method': 'GET',
        'headers': {
            'user-agent': 'es-elasticsearch',
            'authorization': creds
        }        
    };
    https.request(options, function (response) {
        var apiRoot = '';
        response.on('data', function (chunk) {
            apiRoot += chunk;
        });
        response.on('end', function () {
            console.log(apiRoot);
        });
    }).end();
});

 //For the entire API
    //Using the Swagger API, convert each line to Swagger specs