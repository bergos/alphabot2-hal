const bodyParser = require('body-parser')
const express = require('express')
const http = require('http')
const Promise = require('bluebird')

class LedsServer {
  constructor () {
    // throws an error if called without root privileges
    // requiring the module here allows reading default values
    this.ws281x = require('rpi-ws281x-native')

    this.colors = [{
      r: 0, g: 0, b: 0
    }, {
      r: 0, g: 0, b: 0
    }, {
      r: 0, g: 0, b: 0
    }, {
      r: 0, g: 0, b: 0
    }]
  }

  start (options) {
    options = options || {}

    this.number = options.number || LedsServer.defaults.number
    this.port = options.port || LedsServer.defaults.port

    this.ws281x.init(this.number)

    const app = express()

    app.get('/', (req, res) => {
      res.json(this.colors)
    })

    app.put('/', bodyParser.json(), (req, res) => {
      this.colors = req.body

      this.update().then(() => {
        res.json(this.colors)
      })
    })

    this.server = http.createServer(app)

    return Promise.promisify(this.server.listen.bind(this.server))(this.port)
  }

  stop () {
    this.ws281x.reset()

    return Promise.promisify(this.server.close.bind(this.server))()
  }

  update () {
    this.ws281x.render(this.colors.map((color) => {
      return LedsServer.colorToInt(color)
    }))

    return Promise.resolve()
  }

  static colorToInt (c) {
    return ((c.r & 0xff) << 16) + ((c.g & 0xff) << 8) + (c.b & 0xff)
  }
}

LedsServer.defaults = {
  number: 4,
  port: 0x1ed0
}

module.exports = LedsServer
