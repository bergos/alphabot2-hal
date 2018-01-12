const Promise = require('bluebird')

class Speaker {
  constructor (raw) {
    this.raw = raw
  }

  start () {
    return Promise.resolve()
  }

  stop () {
    return Promise.resolve()
  }

  play (frequency, time) {
    return this.raw.play(frequency).then(() => {
      return Promise.delay(time)
    }).then(() => {
      return this.raw.play(0)
    }).then(() => {
      return {frequency: frequency, time: time}
    })
  }
}

module.exports = Speaker
