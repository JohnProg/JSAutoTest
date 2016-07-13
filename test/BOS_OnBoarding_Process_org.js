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
  var caseName = 'BOS_OnBoarding_Process';
  var startTimeString = d.getFullYear()+
                    ''+(d.getMonth()+1)+
                    ''+d.getDate()+
                    '_'+d.getHours()+
                    ':'+d.getMinutes()+
                    ':'+d.getSeconds();
  var logDir = '/tmp/JSAutoTest/Logs/'+caseName+''+startTimeString;
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

  it("Welcome and sliders page", function () {
    return driver
      .sleep(10000)
      .waitForElementById('LoadingImage')
      //.screenshot(driver, logDir+"/WelcomePage")
      .elementById('Have an account? Log in')
      .elementById('Let\\\'s start')
      .then(function (el) {
        return driver.tapping(el);
      })
      .waitForElementById('OnboardingInvoices')
      .elementById('Give us your outstanding client invoices. We\'ll track them.')
      //.screenshot(driver, logDir+"/Slider1")
      .elementByXPath('//UIAApplication[1]/UIAWindow[1]/UIAElement[1]').click()
      .waitForElementById('OnboardingReminders')
      .elementById('When it\\\'s time to get paid, we\\\'ll remind you.')
      //.screenshot(driver, logDir+"/Slider2")
      .swipe({ startX: 300, startY: 200,endX: 50,  endY: 200, duration: 500 })
      .waitForElementById('OnboardingRecommendations')
      //.screenshot(driver, logDir+"/Slider3")
      .elementById('We\\\'ll walk you through the best way to reach out to your client. Good payments make good relationships.')
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
      .waitForElementById('STEP 1 of 5')
      //.screenshot(driver, logDir+'/Initial_Step1_compliance')
      .elementsById('Getting paid faster starts with accurate information.')
      .elementsById('Where should customer send your money?')
      .elementsByClassName('UIATextField')
      // type short Business Name to check alert
      .then(function (els) {
          return els[0]
            .sendKeys('Mor')
            .getValue().should.become('Mor')
      })
      .elementsById('Enter more than 2 characters.')
      //.screenshot(driver, logDir+'/Step1_ShortBusinessNameAlert')
      .elementsByClassName('UIATextField')
      // type Business Name
      .then(function (els) {
          return els[0]
            .sendKeys('gan')
            .getValue().should.become('Morgan')
      })
      .swipe({ startX: 20, startY: 20,endX: 30,  endY: 20, duration: 500 })
      .sleep(500)
      .elementsByClassName('UIATextField')
      // type Business Address
      .then(function (els) {
          return els[1]
            .sendKeys('MorganAddress')
            .getValue().should.become('MorganAddress')
      })
      .swipe({ startX: 20, startY: 20,endX: 30,  endY: 20, duration: 500 })
      .sleep(500)
      .elementsByClassName('UIATextField')
      // type City
      .then(function (els) {
          return els[2]
            .sendKeys('Burbank')
            .getValue().should.become('Burbank')
      })
      .sleep(500)
      .swipe({ startX: 20, startY: 20,endX: 30,  endY: 20, duration: 500 })
      .elementById('State')
      .then(function (el) {
        return driver.tapping(el);
      })
      //.screenshot(driver, logDir+"/Step1_PickerWheel")
      .elementByClassName('UIAPickerWheel')
      .elementById('Cancel').click()
      .elementById('State')
      .getValue().should.become('')
      //.screenshot(driver, logDir+'/Step1_PickerWheelCanceled')
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
      //.screenshot(driver, logDir+"/Step1_AllInputed")
      .elementById('Create profile').click()
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
      .waitForElementById('STEP 2 of 5')
      .elementById('The Right Fit')
      .elementById('Answer a few questions to make sure you belong in our community of small businesses.')
      .elementById('How many employees do you have?')
      //.screenshot(driver, logDir+'/Initial_Step2_compliance')
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
      .waitForElementById('STEP 3 of 5')
      //.screenshot(driver, logDir+'/Initial_Step3_compliance')
      .elementById('The Right Fit')
      .elementById('Answer a few questions to make sure you belong in our community of small businesses.')
      .elementById('Does your business own all or part of any other business?')
      .then(function () {
        var action = new wd.TouchAction(driver);
        action
          //check button
          .tap({x: 100, y: 350})
          .release();
        return driver.performTouchAction(action);
      })
      //.screenshot(driver, logDir+'/Step3_SwitchSelected')
      .then(function () {
        var action = new wd.TouchAction(driver);
        action
          //uncheck button
          .tap({x: 100, y: 350})
          .release();
        return driver.performTouchAction(action);
      })
      //.screenshot(driver, logDir+'/Step3_SwitchDisselect')
      .elementById('Continue').click()
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
      .waitForElementById('STEP 4 of 5')
      .elementById('The Right Fit')
      .elementById('Answer a few questions to make sure you belong in our community of small business.')
      .elementById('Does any other business own all or a part of your business?')
      .then(function () {
        var action = new wd.TouchAction(driver);
        action
          //check button
          .tap({x: 100, y: 350})
          .release();
        return driver.performTouchAction(action);
      })
      //.screenshot(driver, logDir+'/Step4_SwitchSelected')
      .then(function () {
        var action = new wd.TouchAction(driver);
        action
          //uncheck button
          .tap({x: 100, y: 350})
          .release();
        return driver.performTouchAction(action);
      })
      //.screenshot(driver, logDir+'/Step4_SwitchDisselected')
      .elementById('Continue').click()
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
      //.screenshot(driver, logDir+'/Initial_Step5_compliance')
      .sleep(30000)
      .waitForElementById('STEP 5 of 5',30000)
      .elementById('One last thing.')
      .elementById('We take accuracy seriously. Help us confirm  your infomation by tapping it below.')
      .elementById('Don\'t see your business?')
      //.screenshot(driver, logDir+'/Step5_BusinessList')
      .elementById('Continue').click()
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/Compliance5_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/Compliance5_mocha");
      });
  });

  it("Sign up", function () {
    //Sign up
    return driver
      .waitForElementById('You\'re in! Create your account credentials.')
      //.screenshot(driver, logDir+'/Initial_SignUp')
      .elementById('Thanks so much for joining the Business OS community.')
      .elementById('For your privacy, Please follow below criteria:')
      .elementById('* Password must be at least 8 characters long')
      .elementById('* Password must contain at least ')
      .elementById('one number, ')
      .elementById('one uppercase letter, ')
      .elementById('one lowercase letter, ')
      .elementById('one special character.')
      .elementById('By creating an account, you are agreeing to the')
      .elementById('PwC SBS Terms & Conditions')
      .elementById('FINISH UP')
      .elementsByClassName('UIATextField')
      // type something
      .then(function (els) {
          return els[0]
            .sendKeys('JSAutotest2@pwc')
            .getValue().should.become('JSAutotest2@pwc')
            //.screenshot(driver, logDir+'/SignUp_EmailAlert')
            .elementById('Enter valid email address')
      })
      .elementsByClassName('UIATextField')
      .then(function (els) {
          return els[0]
            .sendKeys('.com')
            .getValue().should.become('JSAutotest2@pwc.com');
      })

      .swipe({ startX: 20, startY: 20,endX: 30,  endY: 20, duration: 500 })
      .elementsByClassName('UIASecureTextField')
      // type something
      .then(function (els) {
          return els[0]
            .sendKeys('JSAuto/1')
      })
      .elementById('Show Password').click()
      // .elementsByClassName('UIASecureTextField')
      // // type something
      // .then(function (els) {
      //     return els[0]
      //       .getValue().should.become('JSAuto/1');
      // })
      //.screenshot(driver, logDir+'/SignUp_EmailPasswdFilled')
      .swipe({ startX: 20, startY: 20,endX: 30,  endY: 20, duration: 500 })
      .elementById('PwC SBS Terms & Conditions').click()
      //.screenshot(driver, logDir+'/SignUp_INFOTERMES')
      .swipe({ startX: 20, startY: 20,endX: 30,  endY: 20, duration: 500 })
      // .elementById('INFO_CONDITIONS')
      // .should.not.eventually.exist
      //.screenshot(driver, logDir+'/SignUp_INFOTERMES_Dismissed')
      .elementById('FINISH UP').click()
      .sleep(1000)
      .waitForElementById('Thanks for signing up!')
      //.screenshot(driver, logDir+'/FirstInvoice')
      .elementById('Let\'s get going. Do you have an invoice that we can start tracking? Don\'t worry, we\'ll never initiate or automate contact with your clients.')
      .elementById('Client name')
      .elementById('Amount owed')
      .elementById('Invoice date')
      .elementById('Terms')
      .elementById('Notes')
      .elementById('Add my first invoice')
      .elementById('Skip for now')
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/SignUp_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/SignUp_mocha");
      });
      //validate page after successful sign up
  });

});
