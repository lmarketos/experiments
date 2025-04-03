const http = require('http')
const port = 3000
const {exec} = require('child_process')

// check cpu temp command from https://phoenixnap.com/kb/linux-cpu-temp
// paste <(cat /sys/class/thermal/thermal_zone*/type) <(cat /sys/class/thermal/thermal_zone*/temp) | column -s $'\t' -t | sed 's/\(.\)..$/.\1°C/'
const server = http.createServer(function(req, res) {
  exec('cat /sys/class/thermal/thermal_zone2/temp', 
      (error, stdout, stderr) => {
    if (error) {
      res.write('Error: ${error}')
      return
    }
    res.write(stdout)
    res.end()
  })
})

server.listen(port, function(error) {
  if (error) {
    console.log('Error: ', error)
  } else {
    console.log('Server listening on port ' + port)
  }
});
