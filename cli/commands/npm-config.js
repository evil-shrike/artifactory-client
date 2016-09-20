var ArtClient = require('./../../');

exports.command = 'npm-config <repo> [scope]'
exports.desc = 'get .npmrc config for specified repo and scope'
/*exports.builder = {
  repo: {},
  scope: {}
}*/
exports.builder = function (yargs) {
  return yargs
    //.usage('Usage: art-client npm-config [options]')
    //.demand(['repo'])
    .example('art-client npm-config repo croc --url https://artifacts.company.com/ -u user -p pwd');

  //return yargs.commandDir('remote_cmds')
}
exports.handler = function (argv) {
  console.log('Retriving npm-config (.npmrc) for repo ' + argv.repo + (argv.scope ? " and scope " + argv.scope : ""));

  var client = new ArtClient(argv.url);
  client.getNpmConfig(argv.user, argv.password, argv.repo, argv.scope).then(function (result) {
    console.log('OK');
    console.log(result);
    process.exit(0);
  }).catch(function (err) {
    console.log('Fail');
    console.log(err);
    process.exit(1);
  });

}

