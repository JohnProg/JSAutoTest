"use strict";

require("./helpers/setup");

var wd = require("wd"),
    _ = require('underscore'),
    actions = require("./helpers/actions"),
    serverConfigs = require('./helpers/appium-servers'),
    image = require("./helpers/image"),
    logger = require('./helpers/logging'),
    fs = require('fs');


wd.addPromiseChainMethod('copyFile', logger.copyFile);
wd.addPromiseChainMethod('swipe', actions.swipe);
wd.addPromiseChainMethod('screenshot', image.screenshot);
wd.addPromiseChainMethod('tapping', actions.tapping);
wd.addElementPromiseChainMethod('tapping',
  function () { return this.browser.tapping(this); });

describe("ios actions", function () {
  this.timeout(300000);
  var driver;
  var allPassed = true;

  var d = new Date();
  //*************************************NOTICE!!!*****************************************
  //!!!!!!!!!If you want log saved for check, make sure you followed Step 4 and 5 in
  // chapter "How to use" of '../Readme.txt'!!!!!!!!!
  //*************************************NOTICE!!!*****************************************
  var appiumLogFile = '/tmp/appium.log';
  var mochaLogFile = '/tmp/mocha.log';
  var caseName = 'Adding_Invoice';
  var startTimeString = d.getFullYear()+
                    ''+(d.getMonth()+1)+
                    ''+d.getDate()+
                    '_'+d.getHours()+
                    ':'+d.getMinutes()+
                    ':'+d.getSeconds();
  var logDir = './test/Logs/'+caseName+''+startTimeString;
  try { fs.mkdirSync(logDir); } catch(ign) {};

  before(function () {
    var serverConfig = serverConfigs.local;
    driver = wd.promiseChainRemote(serverConfig);
    require("./helpers/logging").configure(driver);

    var desired = _.clone(require("./helpers/caps").ios91);
    desired.app = require("./helpers/apps").PWCApp;

    return driver.init(desired);
  });

  after(function () {
    return driver
      .screenshot(driver, logDir+'/LastScreenShot')
      .then(function (){
        try { fs.mkdirSync('/tmp/appiumBackupLog'); } catch(ign) {};
        try { fs.mkdirSync('/tmp/mochaBackupLog'); } catch(ign) {};
        logger.copyFile(appiumLogFile, "/tmp/appiumBackupLog/appium"+caseName+''+startTimeString);
        return logger.copyFile(mochaLogFile, "/tmp/mochaBackupLog/mocha"+caseName+''+startTimeString);
      })
      .quit()
      .finally(function () {
        if (process.env.SAUCE) {
          return driver.sauceJobStatus(allPassed);
        }
      });
  });

  afterEach(function () {
    allPassed = allPassed && this.currentTest.state === 'passed';
  });

  it("Welcome and Log in", function () {
    return driver
      .sleep(10000)
      .waitForElementById('LoadingImage')
      //.screenshot(driver, logDir+"/WelcomePage")
      .elementById('Let\\\'s start')
      .elementById('Already have an account? Login').click()
      .elementById('Log in to your account.')
      .elementsByClassName('UIATextField')
      // type something
      .then(function (els) {
          return els[0]
            .sendKeys('JSAutotest@pwc')
            .getValue().should.become('JSAutotest@pwc')
            //.screenshot(driver, logDir+'/SignUp_EmailAlert')
            .elementById('Enter valid email address')
      })
      .elementsByClassName('UIATextField')
      .then(function (els) {
          return els[0]
            .sendKeys('.com')
            .getValue().should.become('JSAutotest@pwc.com');
      })
      .swipe({ startX: 20, startY: 20,endX: 30,  endY: 20, duration: 500 })
      .elementsByClassName('UIASecureTextField')
      // type something
      .then(function (els) {
          return els[0]
            .sendKeys('JSAuto/1')
      })
      .elementById('Show Password').click()
      .swipe({ startX: 20, startY: 20,endX: 30,  endY: 20, duration: 500 })
      //tapping "Log in" button
      .swipe({ startX: 55, startY: 330,endX: 65,  endY: 330, duration: 500 })
      .sleep(3000)
      .elementById('Upcoming Payments')
      .elementById('You haven\'t entered any invoices to track!')
      .elementById('Add your invoices below so we can help you have the right conversation at the right time.')
      .elementById('How does this work?')
      .elementByXPath('//UIAApplication[1]/UIAWindow[1]/UIAElement[2]').click()
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/Login_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/Login_mocha");
      });
  });

  it("Adding Invoice", function () {
    return driver
      .elementById('Add Invoice')
      .elementById('Client name')
      .elementById('Amount owed')
      .elementById('Invoice date')
      .elementById('Terms')
      .elementById('Notes')
      .elementById('Save and finish')
      .elementById('Save and add another')
      .elementsByClassName('UIATextField')
      .then(function (els) {
          return els[0]
            .sendKeys('ClientName')
            .getValue().should.become('ClientName')
      })
      .swipe({ startX: 160, startY: 20,endX: 165,  endY: 20, duration: 500 })
      .elementById('Contact name')
      .elementsByClassName('UIATextField')
      .then(function (els) {
          return els[1]
            .sendKeys('CantactName')
            .getValue().should.become('CantactName')
      })
      .swipe({ startX: 160, startY: 20,endX: 165,  endY: 20, duration: 500 })
      .elementById('Contact email')
      .elementsByClassName('UIATextField')
      .then(function (els) {
          return els[2]
            .sendKeys('CantactEmail@pwc.com')
            .getValue().should.become('CantactEmail@pwc.com')
      })
      .swipe({ startX: 160, startY: 20,endX: 165,  endY: 20, duration: 500 })
      .elementById('Contact phone')
      .elementsByClassName('UIATextField')
      .then(function (els) {
          return els[3]
            .sendKeys('12345678910')
            .getValue().should.become('12345678910')
      })
      .elementsByClassName('UIATextField')
      .then(function (els) {
          return els[4]
            .sendKeys('2000')
      })
      .swipe({ startX: 160, startY: 20,endX: 165,  endY: 20, duration: 500 })
      .elementsByClassName('UIATextField')
      .then(function (els) {
          return els[4]
            .getValue().should.become('2000.00')
      })
      .swipe({ startX: 160, startY: 120,endX: 160,  endY: 20, duration: 500 })
      .elementById('Invoice date')
      .then(function (el) {
        return driver.tapping(el);
      })
      .elementsByClassName('UIAPickerWheel')
      .then(function (els) {
          els[0].sendKeys('August').getValue().should.become('August');
          els[1].sendKeys('3').getValue().should.become('3');
          return els[2].sendKeys('2016').getValue().should.become('2016')
      })
      .elementById('Done').click()
      .elementsByClassName('UIATextField')
      .then(function (els) {
          return els[5].getValue().should.become('Wed Aug 03')
      })
      .elementById('Terms')
      .then(function (el) {
          return driver.tapping(el);
      })
      .elementByClassName('UIAPickerWheel')
      .then(function (el) {
          el.sendKeys('Due in 10 days')
      })
      .elementById('Done').click()
      .elementsByClassName('UIATextField')
      .then(function (els) {
          return els[6].getValue.should.become('Wed Aug 03')
      })
      .elementsByClassName('UIATextFiled')
      .then(function (els) {
          return els[7].sendKeys('Notes11')
                .getValue().should.become('Notes11')
      })
      .swipe({ startX: 160, startY: 20,endX: 165,  endY: 20, duration: 500 })
      //scroll page up to show 'save and finish' button
      .swipe({ startX: 160, startY: 500,endX: 160,  endY: 200, duration: 500 })
      .elementById('Save and finish').click()
      .elementById('This is exciting! You have entered your first invoice!')
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/AddingInvoice_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/AddingInvoice_mocha");
      });
  });

});
