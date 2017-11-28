var child_process = require('child_process');
var fs = require("fs");
var path = require("path");
var os = require("os");
var mkdirp = require("mkdirp");
var xml = require("xml");
var xmldoc = require('xmldoc');

var ArtClient = require('./../../../');
var isWin = process.platform === "win32";
var globalConfig = isWin ? '%AppData%\NuGet\NuGet.Config' : os.homedir() + '/.config/NuGet/NuGet.Config';
exports.command = 'nuget <repo>'
exports.desc = 'Setup NuGet.config for specified repository'
exports.builder = function (yargs) {
  return yargs
    //Windows %AppData%\NuGet\NuGet.Config    
    //Linux ~/.config/NuGet/NuGet.Config
    .option('local', {
      alias: 'l',
      desc: 'setup NuGet.config in the current folder (otherwise ' + globalConfig + ')'
    })
    .example('art-client setup nuget myrepo --url https://artifacts.company.com/ -u user -p pwd');
}
exports.handler = function (argv) {

    var user = argv.user;
    var pwd  = argv.password;
    var repo = argv.repo;
    var url  = argv.url;

    if (url[url.length-1] !== '/') {
        url = url + '/';
    }
    url = url + 'api/nuget/' + repo;

    if (process.platform === 'win32') { 
        // on Win we can use nuget.exe and encrypted passwords
        //nuget Sources Add -Name rnd-virtual -Source https://artifacts.croc.ru/api/nuget/rnd-virtual -User sdorogin -Password DarknessAndHope2!
        var args = ['Sources', 'Add', '-Name'];
        args.push(repo);
        args.push(url);
        if (user) {
            args.push('-User')
            args.push(user);
        }
        if (pwd) {
            args.push('-Password');
            args.push(pwd);
        }
        var child = child_process.spawnSync('nuget.exe', args, {cwd: ".", stdio: 'inherit'});
        if (child.error) {
            throw child.error;
        }
    } else {
        // on *nix we have no nuget executable (at time of .net core 2.0) and cannot encrypt password in configs
        var client = new ArtClient(argv.url);
        //client.logging = true;
        client.getEncryptedPassword(user, pwd).then(function (result) {
            var xml = getNuGetConfig(repo, url, user, result);
            // ~/.config/NuGet/NuGet.Config
            var configDir = path.dirname(globalConfig);
            if (fs.existsSync(globalConfig)) {
            //TODO: other casing: if (fs.exists('NuGet.config') || fs.exists('nuget.config') || fs.exists('NuGet.Config')) {
                // update existing
                var xmlcfg = new xmldoc.XmlDocument(fs.readFileSync(globalConfig));
                // TODO: merge xml
                fs.writeFileSync(globalConfig + '.new', xml);
                console.log(globalConfig + ' exists, created NuGet.Config.new please merge manuallly');
            } else {
                // create a new file
                mkdirp.sync(configDir);
                fs.writeFileSync(globalConfig, xml);
                console.log('Created ' + globalConfig);
            }
            process.exit(0);
        });
    }
}

function getNuGetConfig(repo, repoUrl, user, pwd) {
    var json = {
        'configuration': [{
            'packageSources': [{
                add: { _attr: { key: repo, value: repoUrl}}
            }]
        }]
    };
    if (user)  {
        // <packageSourceCredentials>
        //    <repo>
        //      <add key="User" value="User1"/>
        var cred = {};
        cred[repo] = [
            {add: { _attr: { key: 'User', value: user}}}, 
            {add: { _attr: { key: 'ClearTextPassword', value: pwd}}}
            ];
        json.configuration.push({packageSourceCredentials: [cred]});
    }
    return xml(json, { indent: '  '});
}