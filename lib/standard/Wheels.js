const Promise = require('bluebird')

class Wheels {
  constructor (raw) {
    this.raw = raw
  }

  start () {
    // this.moveEnd = this.moveEndSlow
    this.moveEnd = this.moveEndOpposite

    return Promise.resolve()
  }

  stop () {
    return Promise.resolve()
  }

  move (left, right, time) {
    return this.raw.move(left, right).then(() => {
      if (time) {
        return this.moveEnd(left, right, time)
      }
    }).then(() => {
      return {
        left: left,
        right: right,
        time: time
      }
    })
  }

  moveEndOpposite (left, right, time) {
    const oppositeTime = Math.min(time / 5, 100)

    return Promise.delay(time - oppositeTime).then(() => {
      return this.move(1 - left, 1 - right)
    }).then(() => {
      return Promise.delay(oppositeTime)
    }).then(() => {
      return this.move(0.5, 0.5)
    })
  }

  moveEndSlow (left, right, time) {
    const slowTime = Math.min(time / 2, 500)

    return Promise.delay(time - slowTime).then(() => {
      return Wheels.animate(slowTime, 10, (step) => {
        this.move(Wheels.interpolate(left, 0.5, step), Wheels.interpolate(right, 0.5, step))
      })
    }).then(() => {
      return this.move(0.5, 0.5)
    })
  }

  static interpolate (v0, v1, t) {
    return v0 * (1 - t) + v1 * t
  }

  static animate (time, steps, callback, step) {
    step = step || 0

    return Promise.resolve().then(() => {
      return callback(step)
    }).then(() => {
      if (step >= 1) {
        return Promise.resolve()
      } else {
        return Promise.delay(time / (steps - 1)).then(() => {
          step += 1 / (steps - 1)

          return Wheels.animate(time, steps, callback, step)
        })
      }
    })
  }
}

module.exports = Wheels
