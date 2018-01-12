const Alphabot2HalRaw = require('../raw')
const Camera = require('./Camera')
const RangeFinder = require('./RangeFinder')
const Speaker = require('./Speaker')
const Wheels = require('./Wheels')

class Alphabot2HalStandard {
  constructor (options) {
    this.started = false

    this.raw = new Alphabot2HalRaw(options)

    this.battery = this.raw.battery
    this.camera = new Camera(this.raw.camera)
    this.infraredRemoteControl = this.raw.infraredRemoteControl
    this.obstacleDetection = this.raw.obstacleDetection
    this.rangeFinder = new RangeFinder(this.raw.rangeFinder)
    this.speaker = new Speaker(this.raw.speaker)
    this.wheels = new Wheels(this.raw.wheels)
  }

  start () {
    return this.raw.start().then(() => {
      this.config = this.raw.config

      return Promise.all([
        this.camera.start(this.config.camera),
        this.rangeFinder.start(this.config.rangeFinder),
        this.speaker.start(this.config.speaker),
        this.wheels.start(this.config.wheels)
      ])
    }).then(() => {
      this.started = true
    })
  }

  stop () {
    return Promise.all([
      this.camera.stop(),
      this.rangeFinder.stop(),
      this.speaker.stop(),
      this.wheels.stop()
    ]).then(() => {
      return this.raw.stop()
    }).then(() => {
      this.started = false
    })
  }
}

module.exports = Alphabot2HalStandard
