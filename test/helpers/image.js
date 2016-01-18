"use strict";

var wd = require('wd'),
    Q = require('q'),
    fs = require('fs'),
    shotFlg = true,
    d = new Date();

exports.enableScreenShot = function () {
  shotFlg = true;
}

exports.disableScreenShot = function () {
  shotFlg = false;
}

exports.screenshot = function (driver, logdir, fileName) {
  var d = new Date();
  var CurrentTime = d.getFullYear()+
                   ''+(d.getMonth()+1)+
                   ''+d.getDate()+
                   '_'+d.getHours()+
                   ':'+d.getMinutes()+
                   ':'+d.getSeconds();
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
  var CurrentTime = d.getFullYear()+
                   ''+(d.getMonth()+1)+
                   ''+d.getDate()+
                   '_'+d.getHours()+
                   ':'+d.getMinutes()+
                   ':'+d.getSeconds();
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
