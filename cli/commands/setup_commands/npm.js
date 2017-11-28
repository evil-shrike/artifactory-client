var child_process = require('child_process');
var fs = require("fs");

var ArtClient = require('./../../../');

exports.command = 'npm <repo> [scope]'
exports.desc = 'Setup .npmrc config for specified repository and scope (by default in the current folder)'
exports.builder = function (yargs) {
  return yargs
    //.usage('Usage: art-client npm-config [options]')
    //.demand(['repo'])
    .option('globalconfig', {
      alias: 'g',
      desc: 'setup registry in global npm config file (e.g. /usr/etc/npmrc)'
    })
    .option('userconfig', {
      desc: 'setup registry in current user config file (~/.npmrc)'
    })
    .example('art-client setup npm repo rnd --url https://artifacts.company.com/ -u user -p pwd');
}

exports.handler = function (argv) {

  var client = new ArtClient(argv.url);
  client.logging = true;
  client.getNpmConfig(argv.user, argv.password, argv.repo, argv.scope).then(function (result) {
    if (argv.globalconfig) {
      runNpmConfig(result, true);
      console.log('Success');
    } else if (argv.userconfig) {
      runNpmConfig(result, false);
      console.log('Success');
    } else {
      fs.writeFileSync(".npmrc", result);
      console.log('Created .npmrc');
    }
    //console.log(result);
    process.exit(0);
  }).catch(function (err) {
    console.log('Fail');
    console.log(err);
    process.exit(1);
  });

}

function runNpmConfig(result, global) {
  result.split('\n').forEach(function (line) {
    if (line && line.indexOf("=") > 0) {
      var idx = line.indexOf("=");
      var key = line.substring(0, idx);
      var value = line.substring(idx+1);
      var args = ["config", "set"];
      args.push(key);
      args.push(value);
      //args.push('\"' + key + '\"');
      //args.push('\"' + value + '\"');
      if (global) {
        args.push("-g");
      }
      var cmd = "npm";
      if (process.platform === 'win32') { 
        cmd = "npm.cmd";
      }
      var child = child_process.spawnSync(cmd, args, {cwd: ".", stdio: 'inherit'});
      if (child.error) {
        throw child.error;
      }
    }
  });
}