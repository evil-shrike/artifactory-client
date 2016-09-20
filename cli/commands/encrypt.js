var ArtClient = require('./../../');

exports.command = 'encrypt'
exports.desc = 'get encrypted password for Artifactory user'
exports.builder = function (yargs) {
  return yargs
    .usage('art-client encrypt <options>')
    .demand(['user', 'password'])
    .example('art-client encrypt --url https://artifacts.company.com/ -u user -p pwd');
}
exports.handler = function (argv) {
  console.log('Retriving encrypted password for user ' + argv.user);

  var client = new ArtClient(argv.url);
  client.getEncryptedPassword(argv.user, argv.password).then(function (result) {
    console.log('Encrypted password:');
    console.log(result);
    process.exit(0);
  }).catch(function (err) {
    console.log('Fail');
    console.log(err);
    process.exit(1);
  });

}


