class Speaker {
  constructor (wpi) {
    this.wpi = wpi
  }

  start () {
    this.wpi.softToneCreate(Speaker.defaults.pin)
  }

  stop () {
    this.wpi.softToneWrite(Speaker.defaults.pin, 0)
  }

  play (frequency) {
    this.wpi.softToneWrite(Speaker.defaults.pin, frequency)

    return Promise.resolve({frequency: frequency})
  }
}

Speaker.defaults = {
  pin: 4
}

module.exports = Speaker
