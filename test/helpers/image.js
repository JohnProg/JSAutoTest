"use strict";

var wd = require('wd'),
    Q = require('q'),
    fs = require('fs'),
    d = new Date();

exports.screenshot = function (driver, fileName) {
  var CurrentTime = d.getFullYear()+
                   ''+(d.getMonth()+1)+
                   ''+(d.getDate()+1)+
                   '_'+d.getHours()+
                   ':'+d.getMinutes()+
                   ':'+d.getSeconds();
  return driver
  .takeScreenshot()
    .should.eventually.exist
  // save screenshot to local file
  .then(function () {
    try {
      fs.unlinkSync(fileName+''+CurrentTime+'.png');
    } catch (ign) {}
    fs.existsSync(fileName+''+CurrentTime+'.png').should.not.be.ok;
  })
  .saveScreenshot(fileName+''+CurrentTime+'.png')
  .then(function () {
    fs.existsSync(fileName+''+CurrentTime+'.png').should.be.ok;
  });
};
