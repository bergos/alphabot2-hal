const program = require('commander')
const Alphabot2 = require('..').Standard
const Promise = require('bluebird')

function botCall (callback) {
  const bot = new Alphabot2()

  bot.start().then(() => {
    return callback(bot)
  }).then(() => {
    bot.stop()
  })
}

program
  .command('battery')
  .action(() => {
    botCall((bot) => {
      return bot.battery.voltage().then((voltage) => {
        console.log({
          battery: {
            voltage: voltage
          }
        })
      })
    })
  })

program
  .command('camera')
  .option('-x, --x <n>', 'set x coordinate of the camera', parseFloat)
  .option('-y, --y <n>', 'set y coordinate of the camera', parseFloat)
  .action((options) => {
    botCall((bot) => {
      return Promise.resolve().then(() => {
        if (typeof options.x !== 'undefined' || typeof options.y !== 'undefined') {
          return bot.camera.move(options.x || bot.camera.x, options.y || bot.camera.y).then((result) => {
            return Promise.delay(500).then(() => result)
          })
        } else {
          return {x: bot.camera.x, y: bot.camera.y}
        }
      }).then((result) => {
        console.log({
          camera: {
            x: result.x,
            y: result.y
          }
        })
      })
    })
  })

program
  .command('infrared-remote-control')
  .action(() => {
    botCall((bot) => {
      return bot.infraredRemoteControl.code().then((key) => {
        console.log({
          infraredRemoteControl: {
            key: key
          }
        })
      })
    })
  })

program
  .command('obstacle-detection')
  .action(() => {
    botCall((bot) => {
      return Promise.all([
        bot.obstacleDetection.left(),
        bot.obstacleDetection.right()
      ]).spread((left, right) => {
        console.log({
          obstacleDetection: {
            left: left,
            right: right
          }
        })
      })
    })
  })

program
  .command('range-finder')
  .action(() => {
    botCall((bot) => {
      return bot.rangeFinder.distance().then((distance) => {
        console.log({
          rangeFinder: {
            distance: distance
          }
        })
      })
    })
  })

program
  .command('speaker <frequency> <time>')
  .action((frequency, time) => {
    frequency = parseFloat(frequency)
    time = parseFloat(time)

    botCall((bot) => {
      return bot.speaker.play(frequency, time).then((result) => {
        console.log({
          speaker: result
        })
      })
    })
  })

program
  .command('wheels <left> <right> <time>')
  .action((left, right, time) => {
    left = parseFloat(left)
    right = parseFloat(right)
    time = parseFloat(time)

    botCall((bot) => {
      return bot.wheels.move(left, right, time).then((result) => {
        console.log({
          wheels: result
        })
      })
    })
  })

program.parse(process.argv)
