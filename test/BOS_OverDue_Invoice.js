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
    InvoiceActionItems = require('./helpers/StaticStrings/InvoiceActionItems'),
    Dictionary = require('./helpers/StaticStrings/Dictionary');


wd.addPromiseChainMethod('copyFile', logger.copyFile);
wd.addPromiseChainMethod('swipe', actions.swipe);
wd.addPromiseChainMethod('screenshot', image.screenshot);
wd.addPromiseChainMethod('screenshotAnyway', image.screenshotAnyway);
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
  var caseName = 'BOS_OverDue_Invoice';
  var startTimeString = chore.getCurTimeStr();
  var logDir = '/tmp/JSAutoTest/Logs/'+caseName+''+startTimeString;
  logger.mkdirsSync(logDir);
  logger.mkdirsSync('/tmp/appiumBackupLog');
  logger.mkdirsSync('/tmp/mochaBackupLog');
  serverConfigs.StartAppium('/tmp/appium.log');
  image.enableScreenShot();

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

  it("Welcome and Log in", function () {
    return driver
      .waitForElementById('LoadingImage',10000)
      .screenshot(driver, logDir, 'InitialWelcomePage')
      .elementById('Let\\\'s start')
      .elementById(Dictionary.WhiteListWall.TO_LOGIN).click()
      .elementById(Dictionary.UserAuthentication.LOGIN_HEADER)
      .elementById(Dictionary.UserAuthentication.TO_SIGNUP)
      .elementsByClassName('UIATextField')
      // type something
      .then(function (els) {
          return els[0]
            .sendKeys('JSAutotest@pwc.com')
            .getValue().should.become('JSAutotest@pwc.com')
      })
      .swipe({ startX: 20, startY: 20,endX: 30,  endY: 20, duration: 500 })
      .elementsByClassName('UIASecureTextField')
      // type something
      .then(function (els) {
          return els[0]
            .sendKeys('JSAuto/1')
      })
      .elementById('Show Password').click()
      .screenshot(driver, logDir, 'BeforeHittingLogin')
      .swipe({ startX: 20, startY: 20,endX: 30,  endY: 20, duration: 500 })
      //tapping "Log in" button
      .swipe({ startX: 20, startY: 260,endX: 30,  endY: 260, duration: 500 })
      .sleep(3000)
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/Login_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/Login_mocha");
      });
  });

  it("Adding Invoice", function () {
    return driver
      .elementById(Dictionary.InvoiceList.TITLE)
      .elementById(Dictionary.InvoiceList.WELL_HELP)
      .elementById(Dictionary.InvoiceList.ADD_YOUR_INVOICES)
      .elementById(Dictionary.InvoiceList.INSTRUCTION_BUTTON)
      .elementByXPath('//UIAApplication[1]/UIAWindow[1]/UIAElement[2]').click()
      .elementById(Dictionary.EnterInvoice.TITLE)
      .elementById(Dictionary.EnterInvoice.CLIENT_NAME)
      .elementById(Dictionary.EnterInvoice.AMOUNT_OWED)
      .elementById(Dictionary.EnterInvoice.INVOICE_DATE)
      .elementById(Dictionary.EnterInvoice.TERMS)
      .elementById(Dictionary.EnterInvoice.NOTES)
      .elementById(Dictionary.EnterInvoice.SAVE_AND_FINISH)
      .elementById(Dictionary.EnterInvoice.SAVE_AND_ADD_ANOTHER)
      .screenshot(driver, logDir, 'InitialInvoiceList')
      .elementsByClassName('UIATextField')
      .then(function (els) {
          return els[0]
            .clear()
            .sendKeys('ClientName')
            .getValue().should.become('ClientName')
      })
      .swipe({ startX: 160, startY: 20,endX: 165,  endY: 20, duration: 500 })
      .elementById(Dictionary.EnterInvoice.BILLING_CONTACT_NAME)
      .elementsByClassName('UIATextField')
      .then(function (els) {
          return els[1]
            .clear()
            .sendKeys('ContactName')
            .getValue().should.become('ContactName')
      })
      .swipe({ startX: 160, startY: 20,endX: 165,  endY: 20, duration: 500 })
      .elementById(Dictionary.EnterInvoice.BILLING_CONTACT_EMAIL)
      .elementsByClassName('UIATextField')
      .then(function (els) {
          return els[2]
            .clear()
            .sendKeys('ContactEmail@pwc.com')
            .getValue().should.become('ContactEmail@pwc.com')
      })
      .swipe({ startX: 160, startY: 20,endX: 165,  endY: 20, duration: 500 })
      .elementById(Dictionary.EnterInvoice.BILLING_CONTACT_PHONE)
      .elementsByClassName('UIATextField')
      .then(function (els) {
          return els[3]
            .clear()
            .sendKeys('1234567891')
            .getValue().should.become('1234567891')
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
      .elementById(Dictionary.EnterInvoice.INVOICE_DATE)
      .then(function (el) {
        return driver.tapping(el);
      })
      .elementsByClassName('UIAPickerWheel')
      .then(function (els) {
          els[0].sendKeys('August').getValue().should.become('August');
          els[1].sendKeys('3').getValue().should.become('3');
          return els[2].sendKeys('2026').getValue().should.become('2026');
      })
      .elementById('Done').click()
      .elementById(Dictionary.EnterInvoice.TERMS)
      .then(function (el) {
          return driver.tapping(el);
      })
      .elementByClassName('UIAPickerWheel')
      .then(function (el) {
          return el.sendKeys('Due same day')
      })
      .elementById('Done').click()

      //scroll page up to show 'save and finish' button
      .swipe({ startX: 160, startY: 500,endX: 160,  endY: 200, duration: 500 })
      .screenshot(driver, logDir, 'BeforeSubmittingInvoice')
      .elementById(Dictionary.EnterInvoice.SAVE_AND_FINISH).click()
      .screenshot(driver, logDir, 'AfterSubmittingInvoice')
      //.elementById(Dictionary.EnterInvoice.FIRST_INVOICE_ALERT_TITLE)
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/AddingInvoice_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/AddingInvoice_mocha");
      });
  });

  it("Not Due Invoice", function () {
    return driver
      //checking added invoice in invoice list
      .waitForElementById(Dictionary.CashProgress.EXPECTED,3000)
      .screenshot(driver, logDir, 'InitialNotDueInvoice')
      .elementById('ClientName').click()
      .screenshot(driver, logDir, 'NotDueInvoiceList')
      .elementByXPath('//UIAApplication[1]/UIAWindow[1]/UIAElement[2]').click()
      .screenshot(driver, logDir, 'BeforeNotDueEditingInvoice')
      .elementById(Dictionary.InvoiceDetails.DELETE_LABEL)
      .elementById(Dictionary.InvoiceDetails.EDIT_LABEL)
      //tapping Edit invoice
      .swipe({ startX: 94, startY: 310, endX: 100,  endY: 310, duration: 500 })
      .screenshot(driver, logDir, 'NotDueInvoiceDetails')
      .elementById(Dictionary.EditInvoice.TITLE)
      .elementById(Dictionary.EditInvoice.CLIENT_NAME)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_NAME)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_EMAIL)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_PHONE)
      .elementById(Dictionary.EditInvoice.AMOUNT_OWED)
      .elementById(Dictionary.EditInvoice.INVOICE_DATE)
      .elementById(Dictionary.EditInvoice.TERMS)
      .elementById(Dictionary.EditInvoice.NOTES)
      .elementById(Dictionary.EditInvoice.SAVE_AND_FINISH)
      .swipe({ startX: 60, startY: 420, endX: 60,  endY: 120, duration: 500 })
      .screenshot(driver, logDir, 'NotDueAfterSwipeDown')
      .elementById(Dictionary.EnterInvoice.INVOICE_DATE)
      .then(function (el) {
        return driver.tapping(el);
      })
      .elementsByClassName('UIAPickerWheel')
      .then(function (els) {
          els[0].getValue().should.become('August');
          els[1].getValue().should.become('3');
          return els[2].getValue().should.become('2026');
      })
      .elementById('Done').click()
      .elementById(Dictionary.EnterInvoice.SAVE_AND_FINISH).click()
      .elementById(Dictionary.InvoiceLeads.NOT_DUE)
      .elementById(InvoiceActionItems.InvoiceActionItems.NOT_DUE_Title.replace('BILLING_CONTACT_NAME', 'ContactName'))
      .elementById(Dictionary.InvoiceDetails.MARK_AS_DONE)
      .elementById(InvoiceActionItems.InvoiceActionItems.NOT_DUE_description)
      .elementById(InvoiceActionItems.InvoiceActionItems.NOT_DUE_Title.replace('BILLING_CONTACT_NAME', 'ContactName')).click()
      .screenshot(driver, logDir, 'NotDueTalkingPoints')
      .elementById(InvoiceActionItems.InvoiceActionItems.NOT_DUE_optionTitle)
      //dismiss talking points
      .swipe({ startX: 50, startY: 50,endX: 55,  endY: 50, duration: 500 })
      .screenshot(driver, logDir, 'NotDueinvoice')
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/NotDueInvoice_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/NotDueInvoice_mocha");
      });
  });

  it("Due In 5 Invoice", function() {
    return driver
      .screenshot(driver, logDir, 'InitialDueIn5Invoice')
      .elementByXPath('//UIAApplication[1]/UIAWindow[1]/UIAElement[2]').click()
      .screenshot(driver, logDir, 'BeforeDueIn5EditingInvoice')
      .elementById(Dictionary.InvoiceDetails.DELETE_LABEL)
      .elementById(Dictionary.InvoiceDetails.EDIT_LABEL)
      //tapping Edit invoice
      .swipe({ startX: 94, startY: 310, endX: 100,  endY: 310, duration: 500 })
      .screenshot(driver, logDir, 'InitialDueIn5InvoiceDetails')
      .elementById(Dictionary.EditInvoice.TITLE)
      .elementById(Dictionary.EditInvoice.CLIENT_NAME)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_NAME)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_EMAIL)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_PHONE)
      .elementById(Dictionary.EditInvoice.AMOUNT_OWED)
      .elementById(Dictionary.EditInvoice.INVOICE_DATE)
      .elementById(Dictionary.EditInvoice.TERMS)
      .elementById(Dictionary.EditInvoice.NOTES)
      .elementById(Dictionary.EditInvoice.SAVE_AND_FINISH)
      .swipe({ startX: 60, startY: 420, endX: 60,  endY: 120, duration: 500 })
      .screenshot(driver, logDir, 'DueIn5AfterSwipeDown')
      .elementById(Dictionary.EnterInvoice.INVOICE_DATE)
      .then(function (el) {
        return driver.tapping(el);
      })
      .elementsByClassName('UIAPickerWheel')
      .then(function (els) {
          var DateString = chore.DateCalculator(-5);
          els[0].sendKeys(DateString[0]).getValue().should.become(DateString[0].toString());
          els[1].sendKeys(DateString[1]).getValue().should.become(DateString[1].toString());
          return els[2].sendKeys(DateString[2]).getValue().should.become(DateString[2].toString());
      })
      .elementById('Done').click()
      .screenshot(driver, logDir, 'DueIn5BeforeSubmittingInvoice')
      .elementById(Dictionary.EnterInvoice.SAVE_AND_FINISH).click()
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_WITHIN_5_DAYS_Phone_Title.replace('BILLING_CONTACT_NAME', 'ContactName'))
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_WITHIN_5_DAYS_Phone_description)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_WITHIN_5_DAYS_Email_Title.replace('BILLING_CONTACT_NAME', 'ContactName'))
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_WITHIN_5_DAYS_Email_description)
      .elementById('Mark as done')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_WITHIN_5_DAYS_Email_description)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_WITHIN_5_DAYS_Phone_Title.replace('BILLING_CONTACT_NAME', 'ContactName')).click()
      .screenshot(driver, logDir, 'DueIn5InvoicePhoneTalkingPoints')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_WITHIN_5_DAYS_Phone_New_optionTitle)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_WITHIN_5_DAYS_Phone_Erratic_optionTitle)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_WITHIN_5_DAYS_Phone_Consistently_optionTitle)
      //dismiss talking points
      .swipe({ startX: 50, startY: 50,endX: 55,  endY: 50, duration: 500 })
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_WITHIN_5_DAYS_Email_Title.replace('BILLING_CONTACT_NAME', 'ContactName')).click()
      .screenshot(driver, logDir, 'DueIn5InvoiceEmailTemplates')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_WITHIN_5_DAYS_Email_New_optionTitle)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_WITHIN_5_DAYS_Email_Erratic_optionTitle)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_WITHIN_5_DAYS_Email_Consistently_optionTitle)
      //dismiss Email templates
      .swipe({ startX: 50, startY: 50,endX: 55,  endY: 50, duration: 500 })
      .screenshot(driver, logDir, 'DueIn5Invoice')
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/DueIn5Invoice_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/DueIn5Invoice_mocha");
      });
  });

  it("Due Today Invoice", function() {
    return driver
      .screenshot(driver, logDir, 'InitialDueTodayInvoice')
      .elementByXPath('//UIAApplication[1]/UIAWindow[1]/UIAElement[2]').click()
      .screenshot(driver, logDir, 'BeforeDueTodayEditingInvoice')
      .elementById(Dictionary.InvoiceDetails.DELETE_LABEL)
      .elementById(Dictionary.InvoiceDetails.EDIT_LABEL)
      //tapping Edit invoice
      .swipe({ startX: 94, startY: 310, endX: 100,  endY: 310, duration: 500 })
      .screenshot(driver, logDir, 'InitialDueTodayInvoiceDetails')
      .elementById(Dictionary.EditInvoice.TITLE)
      .elementById(Dictionary.EditInvoice.CLIENT_NAME)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_NAME)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_EMAIL)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_PHONE)
      .elementById(Dictionary.EditInvoice.AMOUNT_OWED)
      .elementById(Dictionary.EditInvoice.INVOICE_DATE)
      .elementById(Dictionary.EditInvoice.TERMS)
      .elementById(Dictionary.EditInvoice.NOTES)
      .elementById(Dictionary.EditInvoice.SAVE_AND_FINISH)
      .swipe({ startX: 60, startY: 420, endX: 60,  endY: 120, duration: 500 })
      .screenshot(driver, logDir, 'DueTodayAfterSwipeDown')
      .elementById(Dictionary.EnterInvoice.INVOICE_DATE)
      .then(function (el) {
        return driver.tapping(el);
      })
      .elementsByClassName('UIAPickerWheel')
      .then(function (els) {
          var DateString = chore.DateCalculator(0);
          els[0].sendKeys(DateString[0]).getValue().should.become(DateString[0].toString());
          els[1].sendKeys(DateString[1]).getValue().should.become(DateString[1].toString());
          return els[2].sendKeys(DateString[2]).getValue().should.become(DateString[2].toString());
      })
      .elementById('Done').click()
      .screenshot(driver, logDir, 'DueTodayBeforeSubmittingInvoice')
      .elementById(Dictionary.EnterInvoice.SAVE_AND_FINISH).click()
      .screenshot(driver, logDir, 'DueTodayAfterSubmittingInvoice')
      .elementById(Dictionary.InvoiceLeads.DUE_TODAY)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_TODAY_Title.replace('BILLING_CONTACT_NAME', 'ContactName'))
      //.elementById(InvoiceActionItems.InvoiceActionItems.DUE_TODAY_description)
      .elementById('If you haven\\\'t already, give your client a call to check in.')
      .elementById('Mark as done')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_TODAY_Title.replace('BILLING_CONTACT_NAME', 'ContactName')).click()
      .screenshot(driver, logDir, 'DueTodayInvoiceTalkingPoints')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_TODAY_optionTitle)
      //dismiss talking points
      .swipe({ startX: 50, startY: 50,endX: 55,  endY: 50, duration: 500 })
      .screenshot(driver, logDir, 'DueTodayInvoice')
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/DueTodayInvoice_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/DueTodayInvoice_mocha");
      });
  });

  it("Due Over 5 Days Invoice", function() {
    return driver
      .screenshot(driver, logDir, 'InitialDueOver5Invoice')
      .elementByXPath('//UIAApplication[1]/UIAWindow[1]/UIAElement[2]').click()
      .screenshot(driver, logDir, 'BeforeDueOver5EditingInvoice')
      .elementById(Dictionary.InvoiceDetails.DELETE_LABEL)
      .elementById(Dictionary.InvoiceDetails.EDIT_LABEL)
      //tapping Edit invoice
      .swipe({ startX: 94, startY: 310, endX: 100,  endY: 310, duration: 500 })
      .screenshot(driver, logDir, 'InitialDueOver5InvoiceDetails')
      .elementById(Dictionary.EditInvoice.TITLE)
      .elementById(Dictionary.EditInvoice.CLIENT_NAME)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_NAME)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_EMAIL)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_PHONE)
      .elementById(Dictionary.EditInvoice.AMOUNT_OWED)
      .elementById(Dictionary.EditInvoice.INVOICE_DATE)
      .elementById(Dictionary.EditInvoice.TERMS)
      .elementById(Dictionary.EditInvoice.NOTES)
      .elementById(Dictionary.EditInvoice.SAVE_AND_FINISH)
      .swipe({ startX: 60, startY: 420, endX: 60,  endY: 120, duration: 500 })
      .screenshot(driver, logDir, 'DueOver5AfterSwipeDown')
      .elementById(Dictionary.EnterInvoice.INVOICE_DATE)
      .then(function (el) {
        return driver.tapping(el);
      })
      .elementsByClassName('UIAPickerWheel')
      .then(function (els) {
          var DateString = chore.DateCalculator(6);
          els[0].sendKeys(DateString[0]).getValue().should.become(DateString[0].toString());
          els[1].sendKeys(DateString[1]).getValue().should.become(DateString[1].toString());
          return els[2].sendKeys(DateString[2]).getValue().should.become(DateString[2].toString());
      })
      .elementById('Done').click()
      .screenshot(driver, logDir, 'DueOver5BeforeSubmittingInvoice')
      .elementById(Dictionary.EnterInvoice.SAVE_AND_FINISH).click()
      .screenshot(driver, logDir, 'DueOver5AfterSubmittingInvoice')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_5_DAYS_Phone_Title.replace('BILLING_CONTACT_NAME', 'ContactName'))
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_5_DAYS_Phone_description)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_5_DAYS_Email_Title.replace('BILLING_CONTACT_NAME', 'ContactName'))
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_5_DAYS_Email_description)
      .elementById('Mark as done')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_5_DAYS_Email_description)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_5_DAYS_Phone_Title.replace('BILLING_CONTACT_NAME', 'ContactName')).click()
      .screenshot(driver, logDir, 'DueOver5InvoicePhoneTalkingPoints')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_5_DAYS_Phone_New_optionTitle)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_5_DAYS_Phone_Erratic_optionTitle)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_5_DAYS_Phone_Consistently_optionTitle)
      //dismiss talking points
      .swipe({ startX: 50, startY: 50,endX: 55,  endY: 50, duration: 500 })
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_5_DAYS_Email_Title.replace('BILLING_CONTACT_NAME', 'ContactName')).click()
      .screenshot(driver, logDir, 'DueOver5InvoiceEmailTemplates')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_5_DAYS_Email_New_optionTitle)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_5_DAYS_Email_Erratic_optionTitle)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_5_DAYS_Email_Consistently_optionTitle)
      //dismiss Email templates
      .swipe({ startX: 50, startY: 50,endX: 55,  endY: 50, duration: 500 })
      .screenshot(driver, logDir, 'DueOver5Invoice')
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/DueOver5Invoice_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/DueOver5Invoice_mocha");
      });
  });

  it("Due Over 10 Days Invoice", function() {
    return driver
      .screenshot(driver, logDir, 'InitialDueOver10Invoice')
      .elementByXPath('//UIAApplication[1]/UIAWindow[1]/UIAElement[2]').click()
      .screenshot(driver, logDir, 'BeforeDueOver10EditingInvoice')
      .elementById(Dictionary.InvoiceDetails.DELETE_LABEL)
      .elementById(Dictionary.InvoiceDetails.EDIT_LABEL)
      //tapping Edit invoice
      .swipe({ startX: 94, startY: 310, endX: 100,  endY: 310, duration: 500 })
      .screenshot(driver, logDir, 'InitialDueOver10InvoiceDetails')
      .elementById(Dictionary.EditInvoice.TITLE)
      .elementById(Dictionary.EditInvoice.CLIENT_NAME)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_NAME)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_EMAIL)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_PHONE)
      .elementById(Dictionary.EditInvoice.AMOUNT_OWED)
      .elementById(Dictionary.EditInvoice.INVOICE_DATE)
      .elementById(Dictionary.EditInvoice.TERMS)
      .elementById(Dictionary.EditInvoice.NOTES)
      .elementById(Dictionary.EditInvoice.SAVE_AND_FINISH)
      .swipe({ startX: 60, startY: 420, endX: 60,  endY: 120, duration: 500 })
      .screenshot(driver, logDir, 'DueOver10AfterSwipeDown')
      .elementById(Dictionary.EnterInvoice.INVOICE_DATE)
      .then(function (el) {
        return driver.tapping(el);
      })
      .elementsByClassName('UIAPickerWheel')
      .then(function (els) {
          var DateString = chore.DateCalculator(11);
          els[0].sendKeys(DateString[0]).getValue().should.become(DateString[0].toString());
          els[1].sendKeys(DateString[1]).getValue().should.become(DateString[1].toString());
          return els[2].sendKeys(DateString[2]).getValue().should.become(DateString[2].toString());
      })
      .elementById('Done').click()
      .screenshot(driver, logDir, 'DueOver10BeforeSubmittingInvoice')
      .elementById(Dictionary.EnterInvoice.SAVE_AND_FINISH).click()
      .screenshot(driver, logDir, 'DueOver10AfterSubmittingInvoice')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_10_DAYS_Phone_Title.replace('BILLING_CONTACT_NAME', 'ContactName'))
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_10_DAYS_Phone_description)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_10_DAYS_Email_Title.replace('BILLING_CONTACT_NAME', 'ContactName'))
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_10_DAYS_Email_description)
      .elementById('Mark as done')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_10_DAYS_Email_description)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_10_DAYS_Phone_Title.replace('BILLING_CONTACT_NAME', 'ContactName')).click()
      .screenshot(driver, logDir, 'DueOver10InvoicePhoneTalkingPoints')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_10_DAYS_Phone_New_optionTitle)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_10_DAYS_Phone_Erratic_optionTitle)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_10_DAYS_Phone_Consistently_optionTitle)
      //dismiss talking points
      .swipe({ startX: 50, startY: 50,endX: 55,  endY: 50, duration: 500 })
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_10_DAYS_Email_Title.replace('BILLING_CONTACT_NAME', 'ContactName')).click()
      .screenshot(driver, logDir, 'DueOver10InvoiceEmailTemplates')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_10_DAYS_Email_New_optionTitle)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_10_DAYS_Email_Erratic_optionTitle)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_10_DAYS_Email_Consistently_optionTitle)
      //dismiss Email templates
      .swipe({ startX: 50, startY: 50,endX: 55,  endY: 50, duration: 500 })
      .screenshot(driver, logDir, 'DueOver10Invoice')
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/DueOver10Invoice_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/DueOver10Invoice_mocha");
      });
  });

  it("Due Over 15 Days Invoice", function() {
    return driver
      .screenshot(driver, logDir, 'InitialDueOver15Invoice')
      .elementByXPath('//UIAApplication[1]/UIAWindow[1]/UIAElement[2]').click()
      .screenshot(driver, logDir, 'BeforeDueOver15EditingInvoice')
      .elementById(Dictionary.InvoiceDetails.DELETE_LABEL)
      .elementById(Dictionary.InvoiceDetails.EDIT_LABEL)
      //tapping Edit invoice
      .swipe({ startX: 94, startY: 310, endX: 100,  endY: 310, duration: 500 })
      .screenshot(driver, logDir, 'InitialDueOver15InvoiceDetails')
      .elementById(Dictionary.EditInvoice.TITLE)
      .elementById(Dictionary.EditInvoice.CLIENT_NAME)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_NAME)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_EMAIL)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_PHONE)
      .elementById(Dictionary.EditInvoice.AMOUNT_OWED)
      .elementById(Dictionary.EditInvoice.INVOICE_DATE)
      .elementById(Dictionary.EditInvoice.TERMS)
      .elementById(Dictionary.EditInvoice.NOTES)
      .elementById(Dictionary.EditInvoice.SAVE_AND_FINISH)
      .swipe({ startX: 60, startY: 420, endX: 60,  endY: 120, duration: 500 })
      .screenshot(driver, logDir, 'DueOver15AfterSwipeDown')
      .elementById(Dictionary.EnterInvoice.INVOICE_DATE)
      .then(function (el) {
        return driver.tapping(el);
      })
      .elementsByClassName('UIAPickerWheel')
      .then(function (els) {
          var DateString = chore.DateCalculator(16);
          els[0].sendKeys(DateString[0]).getValue().should.become(DateString[0].toString());
          els[1].sendKeys(DateString[1]).getValue().should.become(DateString[1].toString());
          return els[2].sendKeys(DateString[2]).getValue().should.become(DateString[2].toString());
      })
      .elementById('Done').click()
      .screenshot(driver, logDir, 'DueOver15BeforeSubmittingInvoice')
      .elementById(Dictionary.EnterInvoice.SAVE_AND_FINISH).click()
      .screenshot(driver, logDir, 'DueOver15AfterSubmittingInvoice')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_15_DAYS_Phone_Title.replace('BILLING_CONTACT_NAME', 'ContactName'))
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_15_DAYS_Phone_description)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_15_DAYS_Email_Title.replace('BILLING_CONTACT_NAME', 'ContactName'))
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_15_DAYS_Email_description)
      .elementById('Mark as done')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_15_DAYS_Phone_Title.replace('BILLING_CONTACT_NAME', 'ContactName')).click()
      .screenshot(driver, logDir, 'DueOver15InvoicePhoneTalkingPoints')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_15_DAYS_Phone_New_optionTitle)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_15_DAYS_Phone_Erratic_optionTitle)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_15_DAYS_Phone_Consistently_optionTitle)
      //dismiss talking points
      .swipe({ startX: 50, startY: 50,endX: 55,  endY: 50, duration: 500 })
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_15_DAYS_Email_Title.replace('BILLING_CONTACT_NAME', 'ContactName')).click()
      .screenshot(driver, logDir, 'DueOver15InvoiceEmailTemplates')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_15_DAYS_Email_New_optionTitle)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_15_DAYS_Email_Erratic_optionTitle)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_15_DAYS_Email_Consistently_optionTitle)
      //dismiss Email templates
      .swipe({ startX: 50, startY: 50,endX: 55,  endY: 50, duration: 500 })
      .screenshot(driver, logDir, 'DueOver15Invoice')
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/DueOver15Invoice_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/DueOver15Invoice_mocha");
      });
  });

  it("Due Over 30 Days Invoice", function() {
    return driver
      .screenshot(driver, logDir, 'InitialDueOver30Invoice')
      .elementByXPath('//UIAApplication[1]/UIAWindow[1]/UIAElement[2]').click()
      .screenshot(driver, logDir, 'BeforeDueOver30EditingInvoice')
      .elementById(Dictionary.InvoiceDetails.DELETE_LABEL)
      .elementById(Dictionary.InvoiceDetails.EDIT_LABEL)
      //tapping Edit invoice
      .swipe({ startX: 94, startY: 310, endX: 100,  endY: 310, duration: 500 })
      .screenshot(driver, logDir, 'InitialDueOver30InvoiceDetails')
      .elementById(Dictionary.EditInvoice.TITLE)
      .elementById(Dictionary.EditInvoice.CLIENT_NAME)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_NAME)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_EMAIL)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_PHONE)
      .elementById(Dictionary.EditInvoice.AMOUNT_OWED)
      .elementById(Dictionary.EditInvoice.INVOICE_DATE)
      .elementById(Dictionary.EditInvoice.TERMS)
      .elementById(Dictionary.EditInvoice.NOTES)
      .elementById(Dictionary.EditInvoice.SAVE_AND_FINISH)
      .swipe({ startX: 60, startY: 420, endX: 60,  endY: 120, duration: 500 })
      .screenshot(driver, logDir, 'DueOver30AfterSwipeDown')
      .elementById(Dictionary.EnterInvoice.INVOICE_DATE)
      .then(function (el) {
        return driver.tapping(el);
      })
      .elementsByClassName('UIAPickerWheel')
      .then(function (els) {
          var DateString = chore.DateCalculator(31);
          els[0].sendKeys(DateString[0]).getValue().should.become(DateString[0].toString());
          els[1].sendKeys(DateString[1]).getValue().should.become(DateString[1].toString());
          return els[2].sendKeys(DateString[2]).getValue().should.become(DateString[2].toString());
      })
      .elementById('Done').click()
      .screenshot(driver, logDir, 'DueOver30BeforeSubmittingInvoice')
      .elementById(Dictionary.EnterInvoice.SAVE_AND_FINISH).click()
      .screenshot(driver, logDir, 'DueOver30AfterSubmittingInvoice')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_30_DAYS_Phone_Title.replace('BILLING_CONTACT_NAME', 'ContactName'))
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_30_DAYS_Phone_description)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_30_DAYS_Email_Title.replace('BILLING_CONTACT_NAME', 'ContactName'))
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_30_DAYS_Email_description)
      .elementById('Mark as done')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_30_DAYS_Email_description)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_30_DAYS_Phone_Title.replace('BILLING_CONTACT_NAME', 'ContactName')).click()
      .screenshot(driver, logDir, 'DueOver30InvoicePhoneTalkingPoints')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_30_DAYS_Phone_optionTitle)
      //dismiss talking points
      .swipe({ startX: 50, startY: 50,endX: 55,  endY: 50, duration: 500 })
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_30_DAYS_Email_Title.replace('BILLING_CONTACT_NAME', 'ContactName')).click()
      .screenshot(driver, logDir, 'DueOver30InvoiceEmailTemplates')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_30_DAYS_Email_optionTitle)
      //dismiss Email templates
      .swipe({ startX: 50, startY: 50,endX: 55,  endY: 50, duration: 500 })
      .screenshot(driver, logDir, 'DueOver30Invoice')
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/DueOver30Invoice_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/DueOver30Invoice_mocha");
      });
  });

  it("Due Over 45 Days Invoice", function() {
    return driver
      .screenshot(driver, logDir, 'InitialDueOver45Invoice')
      .elementByXPath('//UIAApplication[1]/UIAWindow[1]/UIAElement[2]').click()
      .screenshot(driver, logDir, 'BeforeDueOver45EditingInvoice')
      .elementById(Dictionary.InvoiceDetails.DELETE_LABEL)
      .elementById(Dictionary.InvoiceDetails.EDIT_LABEL)
      //tapping Edit invoice
      .swipe({ startX: 94, startY: 310, endX: 100,  endY: 310, duration: 500 })
      .screenshot(driver, logDir, 'InitialDueOver45InvoiceDetails')
      .elementById(Dictionary.EditInvoice.TITLE)
      .elementById(Dictionary.EditInvoice.CLIENT_NAME)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_NAME)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_EMAIL)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_PHONE)
      .elementById(Dictionary.EditInvoice.AMOUNT_OWED)
      .elementById(Dictionary.EditInvoice.INVOICE_DATE)
      .elementById(Dictionary.EditInvoice.TERMS)
      .elementById(Dictionary.EditInvoice.NOTES)
      .elementById(Dictionary.EditInvoice.SAVE_AND_FINISH)
      .swipe({ startX: 60, startY: 420, endX: 60,  endY: 120, duration: 500 })
      .screenshot(driver, logDir, 'DueOver45AfterSwipeDown')
      .elementById(Dictionary.EnterInvoice.INVOICE_DATE)
      .then(function (el) {
        return driver.tapping(el);
      })
      .elementsByClassName('UIAPickerWheel')
      .then(function (els) {
          var DateString = chore.DateCalculator(46);
          els[0].sendKeys(DateString[0]).getValue().should.become(DateString[0].toString());
          els[1].sendKeys(DateString[1]).getValue().should.become(DateString[1].toString());
          return els[2].sendKeys(DateString[2]).getValue().should.become(DateString[2].toString());
      })
      .elementById('Done').click()
      .screenshot(driver, logDir, 'DueOver45BeforeSubmittingInvoice')
      .elementById(Dictionary.EnterInvoice.SAVE_AND_FINISH).click()
      .screenshot(driver, logDir, 'DueOver45AfterSubmittingInvoice')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_45_DAYS_Phone_Title.replace('BILLING_CONTACT_NAME', 'ContactName'))
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_45_DAYS_Phone_description)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_45_DAYS_Email_Title.replace('BILLING_CONTACT_NAME', 'ContactName'))
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_45_DAYS_Email_description)
      .elementById('Mark as done')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_45_DAYS_Email_description)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_45_DAYS_Phone_Title.replace('BILLING_CONTACT_NAME', 'ContactName')).click()
      .screenshot(driver, logDir, 'DueOver45InvoicePhoneTalkingPoints')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_45_DAYS_Phone_optionTitle)
      //dismiss talking points
      .swipe({ startX: 50, startY: 50,endX: 55,  endY: 50, duration: 500 })
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_45_DAYS_Email_Title.replace('BILLING_CONTACT_NAME', 'ContactName')).click()
      .screenshot(driver, logDir, 'DueOver45InvoiceEmailTemplates')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_45_DAYS_Email_optionTitle)
      //dismiss Email templates
      .swipe({ startX: 50, startY: 50,endX: 55,  endY: 50, duration: 500 })
      .screenshot(driver, logDir, 'DueOver45Invoice')
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/DueOver45Invoice_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/DueOver45Invoice_mocha");
      });
  });

  it("Due Over 90 Days Invoice", function() {
    return driver
      .screenshot(driver, logDir, 'InitialDueOver90Invoice')
      .elementByXPath('//UIAApplication[1]/UIAWindow[1]/UIAElement[2]').click()
      .screenshot(driver, logDir, 'BeforeDueOver90EditingInvoice')
      .elementById(Dictionary.InvoiceDetails.DELETE_LABEL)
      .elementById(Dictionary.InvoiceDetails.EDIT_LABEL)
      //tapping Edit invoice
      .swipe({ startX: 94, startY: 310, endX: 100,  endY: 310, duration: 500 })
      .screenshot(driver, logDir, 'InitialDueOver90InvoiceDetails')
      .elementById(Dictionary.EditInvoice.TITLE)
      .elementById(Dictionary.EditInvoice.CLIENT_NAME)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_NAME)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_EMAIL)
      .elementById(Dictionary.EditInvoice.BILLING_CONTACT_PHONE)
      .elementById(Dictionary.EditInvoice.AMOUNT_OWED)
      .elementById(Dictionary.EditInvoice.INVOICE_DATE)
      .elementById(Dictionary.EditInvoice.TERMS)
      .elementById(Dictionary.EditInvoice.NOTES)
      .elementById(Dictionary.EditInvoice.SAVE_AND_FINISH)
      .swipe({ startX: 60, startY: 420, endX: 60,  endY: 120, duration: 500 })
      .screenshot(driver, logDir, 'DueOver90AfterSwipeDown')
      .elementById(Dictionary.EnterInvoice.INVOICE_DATE)
      .then(function (el) {
        return driver.tapping(el);
      })
      .elementsByClassName('UIAPickerWheel')
      .then(function (els) {
          var DateString = chore.DateCalculator(91);
          els[0].sendKeys(DateString[0]).getValue().should.become(DateString[0].toString());
          els[1].sendKeys(DateString[1]).getValue().should.become(DateString[1].toString());
          return els[2].sendKeys(DateString[2]).getValue().should.become(DateString[2].toString());
      })
      .elementById('Done').click()
      .screenshot(driver, logDir, 'DueOver90BeforeSubmittingInvoice')
      .elementById(Dictionary.EnterInvoice.SAVE_AND_FINISH).click()
      .screenshot(driver, logDir, 'DueOver90AfterSubmittingInvoice')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_90_DAYS_Phone_Title.replace('BILLING_CONTACT_NAME', 'ContactName'))
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_90_DAYS_Phone_description)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_90_DAYS_Email_Title.replace('BILLING_CONTACT_NAME', 'ContactName'))
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_90_DAYS_Email_description)
      .elementById('Mark as done')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_90_DAYS_Email_description)
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_90_DAYS_Phone_Title.replace('BILLING_CONTACT_NAME', 'ContactName')).click()
      .screenshot(driver, logDir, 'DueOver90InvoicePhoneTalkingPoints')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_90_DAYS_Phone_optionTitle)
      //dismiss talking points
      .swipe({ startX: 50, startY: 50,endX: 55,  endY: 50, duration: 500 })
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_90_DAYS_Email_Title.replace('BILLING_CONTACT_NAME', 'ContactName')).click()
      .screenshot(driver, logDir, 'DueOver90InvoiceEmailTemplates')
      .elementById(InvoiceActionItems.InvoiceActionItems.DUE_OVER_90_DAYS_Email_optionTitle)
      //dismiss Email templates
      .swipe({ startX: 50, startY: 50,endX: 55,  endY: 50, duration: 500 })
      .screenshot(driver, logDir, 'DueOver90Invoice')
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/DueOver90Invoice_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/DueOver90Invoice_mocha");
      });
  });
});
