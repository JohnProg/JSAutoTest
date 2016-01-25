"use strict";

var wd = require('wd'),
    Q = require('q'),
    fs = require('fs'),
    chore = require('./chore'),
    shotFlg = true,
    d = new Date();

exports.enableScreenShot = function () {
  shotFlg = true;
}

exports.disableScreenShot = function () {
  shotFlg = false;
}

exports.Andscreenshot = function (driver, logdir, fileName) {
  var d = new Date();
  var CurrentTime = chore.getCurTimeStr();
  fileName = CurrentTime+'_'+fileName;
  if (shotFlg) {
    try {
      console.log('start to capture screen for: '+fileName);
      //chore.ADBCmms('connect 127.0.0.1:5554');
      chore.Sleep(2000);
      chore.ADBCmms('shell rm -f /mnt/autotest.png');
      chore.ADBCmms('shell screencap /mnt/autotest.png');
      chore.Sleep(12000);
      chore.ADBCmms('pull /mnt/autotest.png '+logdir+'/'+fileName+'.png');
      chore.Sleep(2000);
      for (var RetryCnt = 0, sleepTime = 3000; RetryCnt < 4; RetryCnt++, sleepTime+=1000){
        if (fs.statSync(logdir+'/'+fileName+'.png')['size']===0){
          console.log('------failed to pull image('+fileName+') out, try again with retryCnt: '+RetryCnt)
          chore.ADBCmms('pull /mnt/autotest.png '+logdir+'/'+fileName+'.png');
          chore.Sleep(sleepTime);
        } else {
          break;
        }
      }
      if (fs.statSync(logdir+'/'+fileName+'.png')['size']===0){
        console.log('------failed to pull image('+fileName+') out finally.');
      }
      //chore.ADBCmms('disconnect');
      console.log('screencap finished at '+chore.getCurTimeStr());
    } catch (e){
      console.log('-------------exception captured while taking screencap for Android:'+e);
    }
  } else {
    console.log('shotFlg is false, will not taking screenshots for:'+fileName);
    return true;
  }
}

exports.AndscreenshotAnyway = function (driver, logdir, fileName) {
  var d = new Date();
  var CurrentTime = chore.getCurTimeStr();
  fileName = CurrentTime+'_'+fileName;
  try {
    console.log('start to capture screen for: '+fileName);
    //chore.ADBCmms('connect 127.0.0.1:5554');
    chore.Sleep(2000);
    chore.ADBCmms('shell rm -f /mnt/autotest.png');
    chore.ADBCmms('shell screencap /mnt/autotest.png');
    chore.Sleep(12000);
    chore.ADBCmms('pull /mnt/autotest.png '+logdir+'/'+fileName+'.png');
    chore.Sleep(2000);
    for (var RetryCnt = 0, sleepTime = 3000; RetryCnt < 4; RetryCnt++, sleepTime+=1000){
      if (fs.statSync(logdir+'/'+fileName+'.png')['size']===0){
        console.log('------failed to pull image('+fileName+') out, try again with retryCnt: '+RetryCnt)
        chore.ADBCmms('pull /mnt/autotest.png '+logdir+'/'+fileName+'.png');
        chore.Sleep(sleepTime);
      } else {
        break;
      }
    }
    if (fs.statSync(logdir+'/'+fileName+'.png')['size']===0){
      console.log('------failed to pull image('+fileName+') out finally.');
    }
    //chore.ADBCmms('disconnect');
    console.log('screencap finished at '+chore.getCurTimeStr());
  } catch (e){
    console.log('-------------exception captured while taking screencap for Android:'+e);
  }
}

exports.screenshot = function (driver, logdir, fileName) {
  var d = new Date();
  var CurrentTime = chore.getCurTimeStr();
  if (shotFlg) {
      return driver
      .sleep(5000)
      .takeScreenshot()
        .should.eventually.exist
      // save screenshot to local file
      .then(function () {
        try {
          fs.unlinkSync(logdir+'/'+CurrentTime+'_'+fileName+'.png');
        } catch (ign) {}
        fs.existsSync(logdir+'/'+CurrentTime+'_'+fileName+'.png').should.not.be.ok;
      })
      .saveScreenshot(logdir+'/'+CurrentTime+'_'+fileName+'.png')
      .then(function () {
        fs.existsSync(logdir+'/'+CurrentTime+'_'+fileName+'.png').should.be.ok;
      });
  } else {
    console.log('shotFlg is false, will not taking screenshots for:'+fileName)
    return true;
  }
};

exports.screenshotAnyway = function (driver, logdir, fileName) {
  var d = new Date();
  var CurrentTime = chore.getCurTimeStr();
  return driver
  .sleep(5000)
  .takeScreenshot()
    .should.eventually.exist
  // save screenshot to local file
  .then(function () {
    try {
      fs.unlinkSync(logdir+'/'+CurrentTime+'_'+fileName+'.png');
    } catch (ign) {}
    fs.existsSync(logdir+'/'+CurrentTime+'_'+fileName+'.png').should.not.be.ok;
  })
  .saveScreenshot(logdir+'/'+CurrentTime+'_'+fileName+'.png')
  .then(function () {
    fs.existsSync(logdir+'/'+CurrentTime+'_'+fileName+'.png').should.be.ok;
  });
};
