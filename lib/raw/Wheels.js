const Promise = require('bluebird')

class Wheels {
  constructor (wpi) {
    this.wpi = wpi
  }

  start () {
    this.left = this.wheel(Wheels.defaults.pins.leftMotorIn1, Wheels.defaults.pins.leftMotorIn2, Wheels.defaults.pins.leftMotorEnable)
    this.right = this.wheel(Wheels.defaults.pins.rightMotorIn1, Wheels.defaults.pins.rightMotorIn2, Wheels.defaults.pins.rightMotorEnable)

    return Promise.resolve()
  }

  stop () {
    return this.move(0.5, 0.5)
  }

  move (left, right) {
    this.left(left * 200 - 100)
    this.right(right * 200 - 100)

    return Promise.resolve({
      left: left,
      right: right
    })
  }

  wheel (in1, in2, enable) {
    this.wpi.softPwmCreate(enable, 0, 100)

    this.wpi.pinMode(in1, this.wpi.OUTPUT)
    this.wpi.pinMode(in2, this.wpi.OUTPUT)

    return (value) => {
      if (value === 0) {
        this.wpi.digitalWrite(in1, this.wpi.LOW)
        this.wpi.digitalWrite(in2, this.wpi.LOW)
        this.wpi.softPwmWrite(enable, 0)
      } else if (value > 0) {
        this.wpi.digitalWrite(in2, this.wpi.LOW)
        this.wpi.digitalWrite(in1, this.wpi.HIGH)
        this.wpi.softPwmWrite(enable, Math.round(value))
      } else if (value < 0) {
        this.wpi.digitalWrite(in1, this.wpi.LOW)
        this.wpi.digitalWrite(in2, this.wpi.HIGH)
        this.wpi.softPwmWrite(enable, -1 * Math.round(value))
      }
    }
  }
}

Wheels.defaults = {
  pins: {
    leftMotorIn1: 12,
    leftMotorIn2: 13,
    leftMotorEnable: 6,
    rightMotorIn1: 21,
    rightMotorIn2: 20,
    rightMotorEnable: 26
  }
}

module.exports = Wheels
