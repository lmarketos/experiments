const http = require('http')
const port = 3000
const {exec} = require('child_process')
const client = require('prom-client')
const collectDefaultMetrics = client.collectDefaultMetrics;
const register = new client.Registry();
const cpuTemp = new client.Gauge({
  name: 'cpu_temp',
  help: 'Current CPU temperature in C'
})
register.registerMetric(cpuTemp);

function updateTemp()
{
   exec('cat /sys/class/thermal/thermal_zone2/temp', 
      (error, stdout, stderr) => {
    if (error) {
      res.write('Error: ${error}')
      return
    }
    cpuTemp.set(Number(stdout));
  })
}
updateTemp()
// check cpu temp command from https://phoenixnap.com/kb/linux-cpu-temp
// paste <(cat /sys/class/thermal/thermal_zone*/type) <(cat /sys/class/thermal/thermal_zone*/temp) | column -s $'\t' -t | sed 's/\(.\)..$/.\1°C/'
const server = http.createServer(async (req, res) => {
      updateTemp();
      res.setHeader('Content-Type', register.contentType);
      res.end(await register.metrics());
  // exec('cat /sys/class/thermal/thermal_zone2/temp', 
  //     (error, stdout, stderr) => {
  //   cpuTemp.set(25);
  //   if (error) {
  //     res.write('Error: ${error}')
  //     return
  //   }
  //   if (req.url === '/metrics') {
  //     res.setHeader('Content-Type', register.contentType);
  //     res.write(await register.metrics());
  //     res.end();
  //   }
  //   else {
  //     res.write(stdout);
  //     res.end();
  //   }
  // })
})

server.listen(port, function(error) {
  if (error) {
    console.log('Error: ', error)
  } else {
    console.log('Server listening on port ' + port)
  }
});
