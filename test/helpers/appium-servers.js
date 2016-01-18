
exports.local = {
  host: 'localhost',
  port: 4723
};

exports.sauce = {
  host: 'ondemand.saucelabs.com',
  port: 80,
  username: process.env.SAUCE_USERNAME,
  password: process.env.SAUCE_ACCESS_KEY
};

exports.StartAppium = function (logPath){
    var spawn = require('child_process').spawn;
    spawn('appium', ['-g','/tmp/appium.log','--log-timestamp','--local-timezone']);
    for(var start = +new Date; +new Date - start <= 15000; ) { };
}
