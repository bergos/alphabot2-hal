const Promise = require('bluebird')

class ObstacleDetection {
  constructor (wpi) {
    this.wpi = wpi
  }

  start () {
    this.wpi.pinMode(ObstacleDetection.defaults.pins.left, this.wpi.INPUT)
    this.wpi.pullUpDnControl(ObstacleDetection.defaults.pins.left, this.wpi.PUD_UP)

    this.wpi.pinMode(ObstacleDetection.defaults.pins.right, this.wpi.INPUT)
    this.wpi.pullUpDnControl(ObstacleDetection.defaults.pins.right, this.wpi.PUD_UP)

    return Promise.resolve()
  }

  stop () {
    return Promise.resolve()
  }

  detect () {
    return Promise.all([
      this.left(),
      this.right()
    ]).spread((left, right) => {
      return {
        left: left,
        right: right
      }
    })
  }

  left () {
    return Promise.resolve(this.wpi.digitalRead(ObstacleDetection.defaults.pins.left) === this.wpi.LOW)
  }

  right () {
    return Promise.resolve(this.wpi.digitalRead(ObstacleDetection.defaults.pins.right) === this.wpi.LOW)
  }
}

ObstacleDetection.defaults = {
  pins: {
    left: 16,
    right: 19
  }
}

module.exports = ObstacleDetection
