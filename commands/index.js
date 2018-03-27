const cmd = require('commander');
const config = require('../package.json');
const actions = require('./actions');

cmd
  .version(`HamJS version ${config.version}`, '-v, --version')

cmd
  .command('create <name>')
  .description('Membuat proyek baru.')
  .action(actions.create)

cmd
  .command('serve')
  .description('Menjalankan proyek.')
  .action(actions.serve)

cmd
  .command('g <type> <name>')
  .description('Membuat file berdasarkan tipe.')
  .action(actions.generate)

const parseArgs = () => {

  cmd.parse(process.argv)

}

module.exports = parseArgs()