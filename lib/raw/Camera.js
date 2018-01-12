const Servo = require('./Servo')

class Camera {
  start () {
    this.pan = new Servo(1)
    this.tilt = new Servo(0)

    return Promise.all([
      this.pan.start(),
      this.tilt.start()
    ])
  }

  stop () {
    return Promise.all([
      this.pan.stop(),
      this.tilt.stop()
    ])
  }

  move (x, y) {
    this.x = this.pan.move(x)
    this.y = this.tilt.move(y)

    return Promise.resolve({x: this.x, y: this.y})
  }
}

module.exports = Camera
