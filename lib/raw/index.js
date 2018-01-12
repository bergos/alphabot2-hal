const fs = require('fs')
const path = require('path')
const wpi = require('node-wiring-pi')
const Battery = require('./Battery')
const Camera = require('./Camera')
const InfraredRemoteControl = require('./InfraredRemoteControl')
const ObstacleDetection = require('./ObstacleDetection')
const Promise = require('bluebird')
const RangeFinder = require('./RangeFinder')
const Speaker = require('./Speaker')
const Wheels = require('./Wheels')

class Alphabot2HalRaw {
  constructor (options) {
    options = options || {}

    this.configFilename = options.configFilename || Alphabot2HalRaw.defaults.configFilename

    this.started = false

    this.battery = new Battery(wpi)
    this.camera = new Camera()
    this.infraredRemoteControl = new InfraredRemoteControl(wpi)
    this.obstacleDetection = new ObstacleDetection(wpi)
    this.rangeFinder = new RangeFinder(wpi)
    this.speaker = new Speaker(wpi)
    this.wheels = new Wheels(wpi)
  }

  start () {
    wpi.wiringPiSetupGpio()

    return this.loadConfig().then((config) => {
      this.config = config

      return Promise.all([
        this.battery.start(this.config.battery),
        this.camera.start(this.config.camera),
        this.infraredRemoteControl.start(this.config.infraredRemoteControl),
        this.obstacleDetection.start(this.config.obstacleDetection),
        this.rangeFinder.start(this.config.rangeFinder),
        this.speaker.start(this.config.speaker),
        this.wheels.start(this.config.wheels)
      ])
    }).then(() => {
      this.started = true
    })
  }

  stop () {
    this.started = false

    return Promise.all([
      this.battery.stop(),
      this.camera.stop(),
      this.infraredRemoteControl.stop(),
      this.obstacleDetection.stop(),
      this.rangeFinder.stop(),
      this.speaker.stop(),
      this.wheels.stop()
    ])
  }

  loadConfig () {
    return new Promise((resolve) => {
      Promise.promisify(fs.readFile)(path.resolve(this.configFilename)).then((content) => {
        resolve(JSON.parse(content) || {})
      }).catch(() => {
        resolve({})
      })
    })
  }
}

Alphabot2HalRaw.defaults = {
  configFilename: 'alphabot2.json'
}

module.exports = Alphabot2HalRaw
