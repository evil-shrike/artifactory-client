var ArtClient = require('./../../../');

exports.command = 'npm <repo> [scope]'
exports.desc = 'Setup .npmrc config for specified repo and scope'
exports.builder = function (yargs) {
  return yargs
    //.usage('Usage: art-client npm-config [options]')
    //.demand(['repo'])
    .option('global', {
      alias: 'g',
      desc: 'setup global default npm repository for current user'
    })
    .example('art-client npm-config repo croc --url https://artifacts.company.com/ -u user -p pwd');

  //return yargs.commandDir('remote_cmds')
}
exports.handler = function (argv) {

  var client = new ArtClient(argv.url);
  client.getNpmConfig(argv.user, argv.password, argv.repo, argv.scope).then(function (result) {
    console.log('OK');
    if (argv.global) {
      
    } else {
      
    }
    console.log(result);
    process.exit(0);
  }).catch(function (err) {
    console.log('Fail');
    console.log(err);
    process.exit(1);
  });

}

