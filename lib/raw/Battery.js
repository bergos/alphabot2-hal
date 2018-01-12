const tlc1543 = require('tlc1543')

class Battery {
  constructor (wpi) {
    this.wpi = wpi
  }

  start () {
    this.read = tlc1543(this.wpi,
      Battery.defaults.pins.clock,
      Battery.defaults.pins.data,
      Battery.defaults.pins.address,
      Battery.defaults.pins.cs)

    return Promise.resolve()
  }

  stop () {
    return Promise.resolve()
  }

  voltage () {
    return Promise.resolve((this.read(Battery.defaults.channel) * 3.3 * 2 / 1024) + 0.4)
  }
}

Battery.defaults = {
  pins: {
    clock: 6,
    data: 15,
    address: 29,
    cs: 21
  },

  channel: 10
}

module.exports = Battery
