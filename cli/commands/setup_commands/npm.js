var child_process = require('child_process');
var fs = require("fs");

var ArtClient = require('./../../../');

exports.command = 'npm <repo> [scope]'
exports.desc = 'Setup .npmrc config for specified repo and scope'
exports.builder = function (yargs) {
  return yargs
    //.usage('Usage: art-client npm-config [options]')
    //.demand(['repo'])
    .option('global', {
      alias: 'g',
      desc: 'setup .npmrc in user profile (otherwise in current folder)'
    })
    .example('art-client npm-config repo rnd --url https://artifacts.company.com/ -u user -p pwd');

  //return yargs.commandDir('remote_cmds')
}
exports.handler = function (argv) {

  var client = new ArtClient(argv.url);
  client.getNpmConfig(argv.user, argv.password, argv.repo, argv.scope).then(function (result) {
    console.log('OK');
    if (argv.global) {
      runNpmConfig(result);
    } else {
      fs.writeFileSync(".npmrc", result);
    }
    //console.log(result);
    process.exit(0);
  }).catch(function (err) {
    console.log('Fail');
    console.log(err);
    process.exit(1);
  });

}

function runNpmConfig(result) {
  result.split('\n').forEach(function (line) {

    if (line && line.indexOf("=") > 0) {
      var idx = line.indexOf("=");
      var key = line.substring(0, idx);
      var value = line.substring(idx+1);
      var args = ["config", "set"];
      args.push(key);
      args.push(value);
      args.push("-g");
      console.log(args.join(","));
      var child = child_process.spawnSync("npm.cmd", args, {cwd:"."});
      if (child.status == 0) {
      } 
      console.log(child.stdout.toString());
      console.log(child.stderr.toString());
    }
  });
}