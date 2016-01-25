"use strict";

require("./helpers/setup");

var wd = require("wd"),
    _ = require('underscore'),
    actions = require("./helpers/actions"),
    serverConfigs = require('./helpers/appium-servers'),
    image = require("./helpers/image"),
    chore = require("./helpers/chore"),
    logger = require("./helpers/logging"),
    _p = require('./helpers/promise-utils'),
    Q = require('q');

wd.addPromiseChainMethod('swipe', actions.swipe);
wd.addPromiseChainMethod('Andscreenshot', image.Andscreenshot);
wd.addPromiseChainMethod('AndscreenshotAnyway', image.AndscreenshotAnyway);

describe("android complex", function () {
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
  var caseName = 'android_complex';
  var startTimeString = chore.getCurTimeStr();
  var logDir = '/tmp/JSAutoTest/Logs/'+caseName+''+startTimeString;
  logger.mkdirsSync(logDir);
  logger.mkdirsSync('/tmp/appiumBackupLog');
  logger.mkdirsSync('/tmp/mochaBackupLog');
  serverConfigs.StartAppium('/tmp/appium.log');
  serverConfigs.StartAndEmulator('ReactNative');
  image.enableScreenShot();

  before(function () {
    var serverConfig = process.env.SAUCE ?
      serverConfigs.sauce : serverConfigs.local;
    driver = wd.promiseChainRemote(serverConfig);
    require("./helpers/logging").configure(driver);

    var desired = process.env.SAUCE ?
      _.clone(require("./helpers/caps").android18) :
      _.clone(require("./helpers/caps").android19);
    desired.app = require("./helpers/apps").androidApiDemos;
    if (process.env.SAUCE) {
      desired.name = 'android - complex';
      desired.tags = ['sample'];
    }
    return driver
      .init(desired)
      .setImplicitWaitTimeout(5000);
  });

  after(function () {
    return driver
      .AndscreenshotAnyway(driver, logDir, 'LastScreenShot')
      .quit()
      .then(function (){
        logger.StopLogcat();
        logger.GetLogcat(logDir, 'TotalLogcat.log');
        serverConfigs.CloseAndEmulator();
        logger.copyFile(appiumLogFile, logDir+'/WholeAppiumLog');
        return logger.copyFile(mochaLogFile, logDir+'/WholeMochaLog');
      })
      .finally(function () {
        if (process.env.SAUCE) {
          return driver.sauceJobStatus(allPassed);
        }
      });
  });

  afterEach(function () {
    allPassed = allPassed && this.currentTest.state === 'passed';
  });

  it("should find an element", function () {
    logger.StartLogcat('-D');
    return driver
      .Andscreenshot(driver, logDir, 'FirstScreenShot')
      .elementByXPath('//android.widget.TextView[@text=\'Animation\']')
      .elementByXPath('//android.widget.TextView')
        .text().should.become('API Demos')
      .elementsByXPath('//android.widget.TextView[contains(@text, "Animat")]')
        .then(_p.filterDisplayed).first()
      .then(function (el) {
        if (!process.env.SAUCE) {
          return el.text().should.become('Animation');
        }
      }).elementByName('App').click()
        .sleep(3000)
      .Andscreenshot(driver, logDir, 'SearchingForClickable')
      .elementsByAndroidUIAutomator('new UiSelector().clickable(true)')
        .should.eventually.have.length.above(10)
      .elementByXPath('//android.widget.TextView[@text=\'Action Bar\']')
        .should.eventually.exist
      .Andscreenshot(driver, logDir, 'BecomeAPIDemos')
      .elementsByXPath('//android.widget.TextView')
        .then(_p.filterDisplayed).first()
        .text().should.become('API Demos')
      .back().sleep(1000)
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/find_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/find_mocha");
      })
  });

  it("should scroll", function () {
    return driver
      .elementByXPath('//android.widget.TextView[@text=\'Animation\']')
      .Andscreenshot(driver, logDir, 'MultiTextView')
      .elementsByXPath('//android.widget.TextView')
      .then(function (els) {
        return Q.all([
          els[7].getLocation(),
          els[3].getLocation()
        ]).then(function (locs) {
          console.log('locs -->', locs);
          return driver.swipe({
            startX: locs[0].x, startY: locs[0].y,
            endX: locs[1].x, endY: locs[1].y,
            duration: 800
          });
        });
      })

      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/scroll_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/scroll_mocha");
      })
  });

  it("should draw a smiley", function () {
    function findTouchPaint() {
      return driver
        .elementsByClassName('android.widget.TextView')
        .then(function (els) {
          return Q.all([
            els[els.length - 1].getLocation(),
            els[0].getLocation()
          ]).then(function (locs) {
            return driver.swipe({
              startX: locs[0].x, startY: locs[0].y,
              endX: locs[1].x, endY: locs[1].y,
              duration: 800
            });
          });
        }).elementByName('Touch Paint')
        .catch(function () {
          return findTouchPaint();
        });
    }

    return driver
      .elementByName('Graphics').click()
      .then(findTouchPaint)
      .click()
      .sleep(5000)
      .Andscreenshot(driver, logDir, 'BeforeDrawing')
      .then(function () {
        var a1 = new wd.TouchAction();
        a1.press({x: 150, y: 100}).release();
        var a2 = new wd.TouchAction();
        a2.press({x: 250, y: 100}).release();
        var smile = new wd.TouchAction();
        smile
          .press({x:110, y:200})
          .moveTo({x:1, y:1})
          .moveTo({x:1, y:1})
          .moveTo({x:1, y:1})
          .moveTo({x:1, y:1})
          .moveTo({x:1, y:1})
          .moveTo({x:2, y:1})
          .moveTo({x:2, y:1})
          .moveTo({x:2, y:1})
          .moveTo({x:2, y:1})
          .moveTo({x:2, y:1})
          .moveTo({x:3, y:1})
          .moveTo({x:3, y:1})
          .moveTo({x:3, y:1})
          .moveTo({x:3, y:1})
          .moveTo({x:3, y:1})
          .moveTo({x:4, y:1})
          .moveTo({x:4, y:1})
          .moveTo({x:4, y:1})
          .moveTo({x:4, y:1})
          .moveTo({x:4, y:1})
          .moveTo({x:5, y:1})
          .moveTo({x:5, y:1})
          .moveTo({x:5, y:1})
          .moveTo({x:5, y:1})
          .moveTo({x:5, y:1})
          .moveTo({x:5, y:0})
          .moveTo({x:5, y:0})
          .moveTo({x:5, y:0})
          .moveTo({x:5, y:0})
          .moveTo({x:5, y:0})
          .moveTo({x:5, y:0})
          .moveTo({x:5, y:0})
          .moveTo({x:5, y:0})
          .moveTo({x:5, y:-1})
          .moveTo({x:5, y:-1})
          .moveTo({x:5, y:-1})
          .moveTo({x:5, y:-1})
          .moveTo({x:5, y:-1})
          .moveTo({x:4, y:-1})
          .moveTo({x:4, y:-1})
          .moveTo({x:4, y:-1})
          .moveTo({x:4, y:-1})
          .moveTo({x:4, y:-1})
          .moveTo({x:3, y:-1})
          .moveTo({x:3, y:-1})
          .moveTo({x:3, y:-1})
          .moveTo({x:3, y:-1})
          .moveTo({x:3, y:-1})
          .moveTo({x:2, y:-1})
          .moveTo({x:2, y:-1})
          .moveTo({x:2, y:-1})
          .moveTo({x:2, y:-1})
          .moveTo({x:2, y:-1})
          .moveTo({x:1, y:-1})
          .moveTo({x:1, y:-1})
          .moveTo({x:1, y:-1})
          .moveTo({x:1, y:-1})
          .moveTo({x:1, y:-1})
          .release();

        var ma = new wd.MultiAction().add(a1, a2, smile);
        return driver.performMultiAction(ma)
          // so you can see it
          .sleep(10000)
          .Andscreenshot(driver, logDir, 'AfterDrawing')
          .back().sleep(1000)
          .back().sleep(1000);
      })

      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/Draw_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/Draw_mocha");
      })
  });

});
