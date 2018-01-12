const i2cBus = require('i2c-bus')
const Pca9685Driver = require('pca9685').Pca9685Driver

class Servo {
  constructor (channel) {
    this.channel = channel
  }

  start () {
    const options = {
      i2c: i2cBus.openSync(1),
      address: 0x40,
      frequency: 50,
      debug: false
    }

    return new Promise((resolve, reject) => {
      this.pwm = new Pca9685Driver(options, (err) => {
        if (err) {
          return reject(err)
        }

        resolve()
      })
    })
  }

  stop () {
    this.pwm.dispose()

    return Promise.resolve()
  }

  move (pos) {
    const pulse = 544 + pos * (2400 - 544)

    this.pwm.setPulseLength(this.channel, pulse)

    return pos
  }
}

module.exports = Servo
