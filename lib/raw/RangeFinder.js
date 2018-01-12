const Promise = require('bluebird')

class RangeFinder {
  constructor (wpi) {
    this.wpi = wpi
  }

  start () {
    this.wpi.pinMode(RangeFinder.defaults.pins.trigger, this.wpi.OUTPUT)
    this.wpi.pinMode(RangeFinder.defaults.pins.echo, this.wpi.INPUT)

    return Promise.resolve()
  }

  stop () {
    return Promise.resolve()
  }

  distance () {
    return Promise.resolve().then(() => {
      this.wpi.digitalWrite(RangeFinder.defaults.pins.trigger, this.wpi.HIGH)

      return Promise.delay(15)
    }).then(() => {
      this.wpi.digitalWrite(RangeFinder.defaults.pins.trigger, this.wpi.LOW)

      while (this.wpi.digitalRead(RangeFinder.defaults.pins.echo) === this.wpi.LOW) {}

      const start = this.wpi.micros()

      while (this.wpi.digitalRead(RangeFinder.defaults.pins.echo) === this.wpi.HIGH) {}

      const end = this.wpi.micros()

      return (end - start) * 0.000344 / 2
    })
  }
}

RangeFinder.defaults = {
  pins: {
    trigger: 22,
    echo: 27
  }
}

module.exports = RangeFinder
