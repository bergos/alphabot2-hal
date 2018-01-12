const fetch = require('node-fetch')
const LedsServer = require('./LedsServer')

class Leds {
  start (options) {
    options = options || {}

    this.port = options.port || LedsServer.defaults.port

    return fetch(this.url()).then(res => res.json()).then((colors) => {
      this.colors = colors
    })
  }

  stop () {
    this.colors = [{
      r: 0, g: 0, b: 0
    }, {
      r: 0, g: 0, b: 0
    }, {
      r: 0, g: 0, b: 0
    }, {
      r: 0, g: 0, b: 0
    }]

    return this.update()
  }

  update () {
    return fetch(this.url(), {
      method: 'put',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(this.colors)
    }).then(res => res.json()).then((colors) => {
      this.colors = colors
    })
  }

  url () {
    return 'http://localhost:' + this.port + '/'
  }
}

module.exports = Leds
