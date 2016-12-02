var ArtClient = require('./../../');

exports.command = 'setup <command>'
exports.desc = 'Setup dev tools to work with Artifactory repos'
/*exports.builder = {
  repo: {},
  scope: {}
}*/
exports.builder = function (yargs) {
  return yargs
    //.usage('Usage: art-client npm-config [options]')
    //.demand(['repo'])
    .commandDir('setup_commands');
    //.example('art-client npm-config repo croc --url https://artifacts.company.com/ -u user -p pwd');

  //return yargs.commandDir('remote_cmds')
}
exports.handler = function (argv) {}
