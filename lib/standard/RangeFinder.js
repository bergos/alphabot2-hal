const Promise = require('bluebird')

class RangeFinder {
  constructor (raw) {
    this.raw = raw
  }

  start (options) {
    options = options || {}

    this.measurement = options.measurement || 3

    return this.raw.start()
  }

  stop () {
    return Promise.resolve()
  }

  distance () {
    const series = []

    for (let i = 0; i < this.measurement; i++) {
      series.push(0)
    }

    return Promise.mapSeries(series, () => {
      return this.raw.distance()
    }).then((distances) => {
      return Math.round(distances.sort().slice(Math.floor(distances.length / 2)).shift() * 100) / 100
    })
  }
}

module.exports = RangeFinder
