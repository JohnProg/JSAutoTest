"use strict";

var random = require("random-js")();

exports.GetRandomInt = function (minimum, maximum) {
  return random.integer(minimum, maximum);
};

exports.ScrollAndShot = function (driver, logDir, screenshotName) {
  return driver
    .swipe({ startX: 30, startY: 400,endX: 30,  endY: 50, duration: 500 })
    .screenshot(driver, logDir, screenshotName);
};

var Month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

exports.DateCalculator = function (OffsetNum) {
  var date = new Date(),
      DateString = new Array();
  date.setDate(date.getDate()-OffsetNum);
  DateString.push(Month[date.getMonth()]);
  DateString.push(date.getDate());
  DateString.push(date.getFullYear());
  console.log('--------------DateString:'+DateString[0]+'_'+DateString[1]+'_'+DateString[2]+'-----------')
  return DateString;
};

exports.Sleep = function (TimeInMS) {
  for(var start = +new Date; +new Date - start <= TimeInMS; ) { };
  return true;
};

exports.ADBCmms = function (cmd) {
    var spawn = require('child_process').spawn;
    var CmdArr = cmd.split(' ');
    var ADBResult = spawn('adb', CmdArr);
    console.log('Carrying out adb command:'+cmd);
    ADBResult.stdout.on('data', function (data) {
      console.log('------stdout:'+data);
    });
    ADBResult.stderr.on('data', function (data) {
      console.log('------stderr:'+data);
    });
};

exports.getCurTimeStr = function (){
    var d = new Date();
    var CurTimeStr = d.getFullYear()+
                  ''+(d.getMonth()+1)+
                  ''+d.getDate()+
                  '_'+d.getHours()+
                  ':'+d.getMinutes()+
                  ':'+d.getSeconds();
    return CurTimeStr;
};
