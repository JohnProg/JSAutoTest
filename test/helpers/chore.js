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
