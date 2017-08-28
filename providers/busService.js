function transformPosition (positionObj) {
  positionObj.longitude += 0.0051
  positionObj.latitude -= 0.00205
  return positionObj
}

exports.getAll = (callback) => {
  wx.$.requestApi({
    method: 'GET',
    route: 'busservice/lines',
    complete (res) {
      if (!Array.isArray(res.data.data.lines)) {
        callback([])
      }
      let lines = res.data.data.lines
      let threads = 0
      for (let line of lines) {
        threads++
        wx.$.requestApi({
          method: 'GET',
          route: 'busservice/lineDetail?lineId=' + line.id,
          complete (res) {
            line.linePoints = res.data.data.line.linePoints.map(k => {
              k.station = transformPosition(k.station)
              return k
            })
            exports.getBus(line.id, buses => {
              line.buses = buses
              threads--
              if (threads === 0) {
                callback(lines)
              }
            })
          }
        })
      }
    }
  })
}

exports.getBus = (id, callback) => {
  wx.$.requestApi({
    method: 'GET',
    route: 'busservice/queryBus?lineId=' + id,
    complete (res) {
      let buses = res.data.data.buses
      buses.forEach(k => k.location = transformPosition(k.location))
      callback(buses)
    }
  })
}