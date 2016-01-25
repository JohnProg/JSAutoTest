"use strict";
var fs = require('fs'),
    path = require('path'),
    chore = require('./chore');

exports.configure = function (driver) {
  // See whats going on
  driver.on('status', function (info) {
    console.log(info.cyan);
  });
  driver.on('command', function (meth, path, data) {
    console.log(' > ' + meth.yellow, path.grey, data || '');
  });
  driver.on('http', function (meth, path, data) {
    console.log(' > ' + meth.magenta, path, (data || '').grey);
  });
};

exports.copyFile = function (source, target) {
    var d = new Date(),
        CurrentTime = d.getFullYear()+
                   ''+(d.getMonth()+1)+
                   ''+(d.getDate()+1)+
                   '_'+d.getHours()+
                   ':'+d.getMinutes()+
                   ':'+d.getSeconds();

    return new Promise(function(resolve, reject) {
        var rd = fs.createReadStream(source);
        rd.on('error', reject);
        var wr = fs.createWriteStream(target+'_'+CurrentTime+'.log');
        wr.on('error', reject);
        wr.on('finish', resolve);
        rd.pipe(wr);
    });
};

exports.mkdirsSync = function (dirname, mode){
    console.log(dirname);
    if(fs.existsSync(dirname)){
        return true;
    }else{
        if(this.mkdirsSync(path.dirname(dirname), mode)){
            fs.mkdirSync(dirname, mode);
            return true;
        }
    };
};

var LogcatSpawn = require('child_process').spawn;
var ResLogcatSpawn;

exports.StartLogcat = function (tag){
    //chore.ADBCmms('connect 127.0.0.1:5554');
    chore.Sleep(2000);
    chore.ADBCmms('shell rm -f /mnt/logcat.log');
    chore.Sleep(2000);
    console.log('--------going to get logcat');
    ResLogcatSpawn=LogcatSpawn('adb', ['shell', "logcat "+tag+" > /mnt/logcat.log"]);
    ResLogcatSpawn.stdout.on('data', function (data) {
      console.log('------Logcat stdout:'+data);
    });
    ResLogcatSpawn.stderr.on('data', function (data) {
      console.log('------Logcat stderr:'+data);
    });
    //chore.ADBCmms('disconnect');
};

exports.GetLogcat = function (logDir, fileName){
    var chore = require('./chore');
    var spawn = require('child_process').spawn;
    //chore.ADBCmms('connect 127.0.0.1:5554');
    chore.Sleep(2000);
    chore.ADBCmms('shell ls -al /mnt/logcat.log');
    chore.ADBCmms('pull /mnt/logcat.log '+logDir+'/'+fileName);
    chore.Sleep(2000);
    console.log('--------pulling logcat('+fileName+') finished');
    chore.ADBCmms('shell rm -f /mnt/logcat.log')
    //chore.ADBCmms('disconnect');
};

exports.StopLogcat = function (){
    ResLogcatSpawn.kill('SIGHUP');
}
