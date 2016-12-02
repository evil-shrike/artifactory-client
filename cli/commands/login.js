var ArtClient = require('./../../');
var fs = require("fs");

exports.command = 'login'
exports.desc = 'Creates an .art-rc file with cached Artifactory url and user credentials to be used for all subsequent commands'
exports.builder = function (yargs) {
  return yargs
    //.usage('Usage: art-client npm-config [options]')
    .demand(['url'])
    .example('art-client login --url https://artifacts.company.com/ -u user -p');

  //return yargs.commandDir('remote_cmds')
}
exports.handler = function (argv) {
  //console.log('Retriving npm-config (.npmrc) for repo ' + argv.repo + (argv.scope ? " and scope " + argv.scope : ""));
  var client = new ArtClient(argv.url);
  client.getEncryptedPassword(argv.user, argv.password).then(function (result) {
    console.log('Login successfull');
    var config = {
      url: argv.url,
      user: argv.user,
      password: result //argv.password
    };
    fs.writeFileSync('.art-rc', JSON.stringify(config, "  "));
    process.exit(0);
  }).catch(function (err) {
    console.log('Login failed');
    console.log(err);
    process.exit(1);
  });
}