#!/usr/bin/env node

// TODO:
// setup npm --global --client -> .npmrc
// setup bower  -> .bowerrc
// setup nuget -> nuget.config
// connectas --user xxx --password yyy => OK/FAIL
// encrypt  --user xxx --password yyy => pwd

var yargs = require('yargs');
var ArtClient = require('./../');
var path = require('path');

var conf = yargs
    .help('help').alias('h', 'help')
    .version()
    .alias('v', 'version')
    .showHelpOnFail(true)
    .usage('Tool for interacting with Artifactory (http://www.jfrog.com/artifactory).\nUsage: art-client <command> [options]')
    //.example('art-client npm-config --url https://artifacts.company.com/ -u user -p pwd')
    .config('c')
    .option('url', {
        describe: 'Artifactory base url (e.g. "https://artifacts.company.com" or "https://artifacts.company.com/artifactory")'
    })
    .option('user', {
        alias: 'u',
        describe: 'Artifactory user name'
    })
    .option('password', {
        alias: 'p',
        describe: 'Artifactory user password'
    })
    .implies('user', 'password')
    .option('proxy', {
        describe: 'A proxy url to use for sending http requests'
    })
    .commandDir('commands')
    .epilog('Have fun.')
    .global(['url', 'user', 'password'])
    .demand(['url'])
    .epilog('Copyright 2016-2017 (c) Sergei Dorogin')
    .argv;

var options = {};
if (conf.user) {
    options.credentials = {
        username: conf.user,
        password: conf.password
    };
}

if (conf.proxy) {
    options.proxy = conf.proxy;
}

/*
var client = new ArtClient(conf.url);
client.setAuth(conf.user, conf.password);
client.getNpmConfig().then(function () {
    console.log('OK');
    process.exit(0);
}).catch(function (err) {
    console.log('Fail');
    console.log(err);
    process.exit(1);
});
*/