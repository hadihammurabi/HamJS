const cmd = require('commander');
const config = require('../package.json');
const actions = require('./actions');

const commands = [
  {
    cmd: 'create <name>',
    description: 'Membuat proyek baru.',
    action: actions.create,
  }, {
    cmd: 'serve',
    description: 'Menjalankan proyek.',
    action: actions.serve,
  }, {
    cmd: 'g <type> <name>',
    description: 'Membuat file berdasarkan tipe.',
    action: actions.generate,
  },
]

cmd
  .version(`HamJS version ${config.version}`, '-v, --version')

cmd
  
commands.forEach(command => {
  cmd
    .command(command.cmd)
    .description(command.description)
    .action(command.action)
})

const parseArgs = () => {

  cmd.parse(process.argv)

}

module.exports = parseArgs()