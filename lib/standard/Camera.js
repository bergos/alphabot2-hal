class Camera {
  constructor (raw) {
    this.raw = raw
  }

  start (options) {
    options = options || {}

    this.limit = options.limit || {}
    this.limit.x = this.limit.x || {min: 0.25, max: 0.75}
    this.limit.y = this.limit.y || {min: 0.25, max: 0.75}
    this.offset = options.offset || {x: 0, y: 0}

    return this.move(0.5, 0.5)
  }

  stop () {
    return Promise.resolve()
  }

  move (x, y) {
    x = Math.min(Math.max(x, this.limit.x.min), this.limit.x.max)
    y = Math.min(Math.max(y, this.limit.y.min), this.limit.y.max)

    return this.raw.move(x + this.offset.x, 1 - y + this.offset.y).then(() => {
      this.x = x
      this.y = y

      return {x: this.x, y: this.y}
    })
  }
}

module.exports = Camera
