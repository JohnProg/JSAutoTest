"use strict";

require("./helpers/setup");

var wd = require("wd"),
    _ = require('underscore'),
    actions = require("./helpers/actions"),
    serverConfigs = require('./helpers/appium-servers'),
    image = require("./helpers/image"),
    logger = require('./helpers/logging'),
    fs = require('fs'),
    chore = require('./helpers/chore'),
    _p = require('./helpers/promise-utils'),
    Dictionary = require('./helpers/StaticStrings/Dictionary');


wd.addPromiseChainMethod('copyFile', logger.copyFile);
wd.addPromiseChainMethod('swipe', actions.swipe);
wd.addPromiseChainMethod('screenshot', image.screenshot);
wd.addPromiseChainMethod('screenshotAnyway', image.screenshotAnyway);
wd.addPromiseChainMethod('ScrollAndShot', chore.ScrollAndShot);
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
  var caseName = 'BOS_OnBoarding_Process_Undetermined';
  var startTimeString = logger.getCurTimeStr();
  var logDir = '/tmp/JSAutoTest/Logs/'+caseName+''+startTimeString;
  logger.mkdirsSync(logDir);
  logger.mkdirsSync('/tmp/appiumBackupLog');
  logger.mkdirsSync('/tmp/mochaBackupLog');
  serverConfigs.StartAppium('/tmp/appium.log');
  //image.disableScreenShot();

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
      .screenshotAnyway(driver, logDir, 'LastScreenShot')
      .sleep(2000)
      .quit()
      .then(function (){
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

  function clickMenuItem(name) {
    return driver
      .elementByName(name)
      .catch(function () {
        return driver
          .elementByClassName('UIATableView')
          .elementsByClassName('>','UIATableCell')
          .then(_p.filterWithName(name)).first();
      }).click();
  }

  it("Welcome and sliders page", function () {
    return driver
      .sleep(3000)
      .waitForElementById('LoadingImage')
      .screenshot(driver, logDir, 'WelcomePage')
      .elementById(Dictionary.WhiteListWall.TO_LOGIN)
      .elementById('Let\\\'s start')
      .then(function (el) {
        return driver.tapping(el);
      })
      .waitForElementById('OnboardingInvoices')
      .elementById(Dictionary.NewUserExperience.ONBOARDING_HEADER_INVOICES)
      .screenshot(driver, logDir, 'Slider1_')
      .swipe({ startX: 300, startY: 200,endX: 50,  endY: 200, duration: 500 })
      .waitForElementById('OnboardingReminders')
      .elementById(Dictionary.NewUserExperience.ONBOARDING_HEADER_REMINDERS)
      .screenshot(driver, logDir, 'Slider2_')
      .swipe({ startX: 300, startY: 200,endX: 50,  endY: 200, duration: 500 })
      .waitForElementById('OnboardingRecommendations')
      .screenshot(driver, logDir, 'Slider3_')
      .elementById(Dictionary.NewUserExperience.ONBOARDING_HEADER_RECOMMENDATIONS)
      .elementById('Sign up').click()
      .sleep(1000)
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/Welcome_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/Welcome_mocha");
      });
  });

  it("Compliance 1", function () {
    //step 1 of 5
    return driver
      .waitForElementById(Dictionary.Compliance.STEP1)
      .screenshot(driver, logDir, 'Initial_Step1_compliance')
      .elementById(Dictionary.Compliance.STEP1_TITLE)
      .elementById(Dictionary.Compliance.STEP1_DESCRIPTION)
      .elementsByClassName('UIATextField')
      // type short Business Name to check alert
      .then(function (els) {
          return els[0]
            .sendKeys('Mo')
            .getValue().should.become('Mo')
      })
      .elementById(Dictionary.Compliance.STEP1_BUSINESS_NAME_ERROR)
      .should.eventually.exist
      .screenshot(driver, logDir, 'Step1_ShortBusinessNameAlert')
      .elementsByClassName('UIATextField')
      // type Business Name
      .then(function (els) {
          return els[0]
            .sendKeys('rgan')
            .getValue().should.become('Morgan')
      })
      //.swipe({ startX: 5, startY: 20,endX: 10,  endY: 20, duration: 500 })
      .sleep(500)
      .elementsByClassName('UIATextField')
      .then(function (els) {
        return driver.tapping(els[1]);
      })
      // type Business Address
      .elementsByClassName('UIATextField')
      .then(function (els) {
          return els[1]
            .sendKeys('MorganAddress')
            .getValue().should.become('MorganAddress')
      })
      //.swipe({ startX: 20, startY: 20,endX: 30,  endY: 20, duration: 500 })
      .sleep(500)
      .elementsByClassName('UIATextField')
      .then(function (els) {
        return driver.tapping(els[2]);
      })
      .elementsByClassName('UIATextField')
      // type City
      .then(function (els) {
          return els[2]
            .sendKeys('Burbank')
            .getValue().should.become('Burbank')
      })
      .sleep(500)
      .screenshot(driver, logDir, 'BeforePickerWheel')
      .swipe({ startX: 20, startY: 20,endX: 30,  endY: 20, duration: 500 })
      .elementById('State')
      .then(function (el) {
        return driver.tapping(el);
      })
      .screenshot(driver, logDir, 'Step1_PickerWheel')
      .elementByClassName('UIAPickerWheel')
      .elementById('Cancel').click()
      .elementById('State')
      .getValue().should.become('')
      .screenshot(driver, logDir, 'Step1_PickerWheelCanceled')
      //selecting State
      .elementById('State')
      .then(function (el) {
        return driver.tapping(el);
      })
      .elementByClassName('UIAPickerWheel')
      .then(function (el) {
          return el
            .sendKeys('CA')
            .getValue().should.become('CA')
      })
      .sleep(500)
      .elementById('Done').click()
      .sleep(500)
      .screenshot(driver, logDir, 'AfterAllInputed')
      .elementById(Dictionary.Compliance.STEP1_CREATE).click()
      .sleep(1000)
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/Compliance1_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/Compliance1_mocha");
      });
  });

  it("Compliance 2", function () {
    //step 2 of 5
    return driver
      .waitForElementById(Dictionary.Compliance.STEP2)
      .elementById(Dictionary.Compliance.STEP2_TITLE)
      .elementById(Dictionary.Compliance.STEP2_DESCRIPTION)
      .elementById(Dictionary.Compliance.STEP2_PROMPT)
      .screenshot(driver, logDir, 'Initial_Step2_compliance')
      .then(function () {
        var action = new wd.TouchAction(driver);
        action
          //taping "just one" button
          .tap({x: 100, y: 340})
          .release();
        return driver.performTouchAction(action);
      })
      .sleep(1000)
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/Compliance2_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/Compliance2_mocha");
      });

  });

  it("Compliance 3", function () {
    //step 3 of 5
    return driver
      .waitForElementById(Dictionary.Compliance.STEP3)
      .screenshot(driver, logDir, 'Initial_Step3_compliance')
      .elementById(Dictionary.Compliance.STEP3_TITLE)
      .elementById(Dictionary.Compliance.STEP3_DESCRIPTION)
      .elementById(Dictionary.Compliance.STEP3_PROMPT)
      .then(function () {
        var action = new wd.TouchAction(driver);
        action
          //check button
          .tap({x: 100, y: 350})
          .release();
        return driver.performTouchAction(action);
      })
      .screenshot(driver, logDir, 'Step3_SwitchSelected')
      .then(function () {
        var action = new wd.TouchAction(driver);
        action
          //uncheck button
          .tap({x: 100, y: 350})
          .release();
        return driver.performTouchAction(action);
      })
      .screenshot(driver, logDir, 'Step3_SwitchDisselect')
      .elementById(Dictionary.Compliance.STEP3_CONTINUE).click()
      .sleep(1000)
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/Compliance3_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/Compliance3_mocha");
      });

  });

  it("Compliance 4", function () {
    //step 4 of 5
    return driver
      .waitForElementById(Dictionary.Compliance.STEP4)
      .elementById(Dictionary.Compliance.STEP4_TITLE)
      .elementById(Dictionary.Compliance.STEP4_DESCRIPTION)
      .elementById(Dictionary.Compliance.STEP4_PROMPT)
      .then(function () {
        var action = new wd.TouchAction(driver);
        action
          //check button
          .tap({x: 100, y: 350})
          .release();
        return driver.performTouchAction(action);
      })
      .screenshot(driver, logDir, 'Step4_SwitchSelected')
      .then(function () {
        var action = new wd.TouchAction(driver);
        action
          //uncheck button
          .tap({x: 100, y: 350})
          .release();
        return driver.performTouchAction(action);
      })
      .screenshot(driver, logDir, 'Step4_SwitchDisselected')
      .elementById(Dictionary.Compliance.STEP4_CONTINUE).click()
      .sleep(1000)
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/Compliance4_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/Compliance4_mocha");
      });
  });


  it("Compliance 5", function () {
    //step 5 of 5
    return driver
      .screenshot(driver, logDir, 'Initial_Step5_compliance')
      //.sleep(30000)
      .waitForElementById(Dictionary.Compliance.CONTINUE,30000)
      .elementById(Dictionary.Compliance.STEP5)
      .elementById(Dictionary.Compliance.STEP5_TITLE)
      .elementById(Dictionary.Compliance.STEP5_DESCRIPTION)
      .elementById(Dictionary.Compliance.DONT_SEE_YOUR_BUSINESS)
      .screenshot(driver, logDir, 'Step5_BusinessList')
      .elementById('4000 Warner Blvd 76 CA,91522').click()
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/Compliance5_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/Compliance5_mocha");
      });
  });

  it("Sorry Page", function () {
    //Sign up
    return driver
      .sleep(3000)
      .screenshot(driver, logDir, 'LoadingAtStep5')
      .waitForElementById(Dictionary.Compliance.NOT_COMPLIANT_PROMPT1,5000)
      .screenshot(driver, logDir, 'InitialSorry_Page')
      .elementById(Dictionary.Compliance.NOT_COMPLIANT_PROMPT2)
      .elementById(Dictionary.Compliance.NOT_COMPLIANT_PROMPT3)
      .elementById(Dictionary.Compliance.NOT_COMPLIANT_PROMPT4)
      .screenshot(driver, logDir, 'Sorry_Page')
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/SignUp_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/SignUp_mocha");
      });
      //validate page after successful sign up
  });

});
