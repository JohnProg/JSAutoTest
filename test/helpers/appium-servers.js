var chore = require('./chore');

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
    chore.Sleep(15000);
}

exports.StartAndEmulator = function (EmulatorName){
    this.CloseAndEmulator();
    chore.Sleep(2000);
    var spawn = require('child_process').spawn;
    spawn('emulator', ['@'+EmulatorName]);
    chore.Sleep(15000);
}

exports.CloseAndEmulator = function (){
    var exec = require('child_process').exec;
    exec('ps -Aax|grep emulator|xargs kill -9');
}
