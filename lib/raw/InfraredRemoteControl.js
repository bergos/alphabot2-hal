const Promise = require('bluebird')

class InfraredRemoteControl {
  constructor (wpi) {
    this.wpi = wpi
  }

  start () {
    this.wpi.pinMode(InfraredRemoteControl.defaults.pin, this.wpi.INPUT)

    return Promise.resolve()
  }

  stop () {
    return Promise.resolve()
  }

  readPin () {
    return this.wpi.digitalRead(InfraredRemoteControl.defaults.pin) === this.wpi.HIGH
  }

  pulseLength (min, max, flag) {
    const ref = this.wpi.micros()
    const start = ref + min * 1000
    const end = ref + max * 1000

    while (true) {
      if (this.readPin() === flag) {
        const now = this.wpi.micros()

        if (now < start) {
          return false
        }

        return (now - ref) / 1000
      }

      if (this.wpi.micros() >= end) {
        return false
      }
    }
  }

  decode () {
    // wait for signal...
    if (!this.pulseLength(0, 20000, false)) {
      return Promise.resolve()
    }

    // prefix
    if (!this.pulseLength(8, 10, true)) {
      return Promise.resolve()
    }

    if (!this.pulseLength(3.5, 5.5, false)) {
      return Promise.resolve()
    }

    // pulse lengths
    const times = []

    for (let i = 0; i < 64; i++) {
      const time = this.pulseLength(-1, 5.5, !(i & 1))

      times.push(time)
    }

    // decode pulse lengths
    const data = []

    for (let i = 0; i < 4; i++) {
      let byte = 0

      for (let j = 0; j < 8; j++) {
        if (times[(i * 8 + j) * 2 + 1] > 1) {
          byte |= 1 << j
        }
      }

      data.push(byte)
    }

    if (data[0] + data[1] === 0xff && data[2] + data[3] === 0xff) {
      return Promise.resolve(data[2])
    }

    return Promise.resolve()
  }

  code () {
    let count = 0

    const next = () => {
      count++

      if (count > 100) {
        return Promise.resolve()
      }

      return this.decode().then((value) => {
        if (typeof value !== 'undefined') {
          return value
        } else {
          return next()
        }
      })
    }

    return next()
  }
}

InfraredRemoteControl.defaults = {
  pin: 17
}

module.exports = InfraredRemoteControl
