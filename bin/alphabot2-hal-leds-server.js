const program = require('commander')
const LedsServer = require('../lib/raw/LedsServer')

program
  .option('-p, --port <port>', 'listener port', parseFloat, LedsServer.defaults.port)
  .parse(process.argv)

const ledsServer = new LedsServer()

ledsServer.init({
  port: program.port
}).then(() => {
  console.log('listening at http://localhost:' + program.port + '/')
}).catch((err) => {
  console.error(err)
})

process.on('SIGINT', () => {
  console.log('Gracefully shutting down from SIGINT (Ctrl-C)')

  ledsServer.stop()

  process.exit()
})
