"use strict";

require("./helpers/setup");

var wd = require("wd"),
    _ = require('underscore'),
    actions = require("./helpers/actions"),
    serverConfigs = require('./helpers/appium-servers'),
    image = require("./helpers/image"),
    logger = require('./helpers/logging'),
    chore = require('./helpers/chore'),
    fs = require('fs'),
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
  var caseName = 'BOS_Adding_Invoice';
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
      .sleep(10000)
      .waitForElementById('LoadingImage')
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
      .sleep(3000)
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
            .getValue().should.become('2000.00')
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
          return el.sendKeys('Due in 10 days')
      })
      .elementById('Done').click()
      //scroll page up to show 'save and finish' button
      .swipe({ startX: 160, startY: 500,endX: 160,  endY: 200, duration: 500 })
      .screenshot(driver, logDir, 'BeforeSubmittingInvoice')
      .elementById(Dictionary.EnterInvoice.SAVE_AND_FINISH).click()
      //.elementById(Dictionary.EnterInvoice.FIRST_INVOICE_ALERT_TITLE)
      .screenshot(driver, logDir, 'FirstInvoiceAlert')
      .elementById(Dictionary.EnterInvoice.FIRST_INVOICE_ALERT_TITLE)
      .elementById(Dictionary.EnterInvoice.FIRST_INVOICE_ALERT_TEXT)
      .elementById(Dictionary.EnterInvoice.FIRST_INVOICE_ACCEPT_CAPTION)
      .elementById(Dictionary.EnterInvoice.FIRST_INVOICE_REJECT_CAPTION).click()
      .screenshot(driver, logDir, 'RejectPrimer')
      .elementById(Dictionary.EnterInvoice.REJECT_PRIMER_TITLE)
      .elementById(Dictionary.EnterInvoice.REJECT_PRIMER_TEXT)
      .elementById(Dictionary.EnterInvoice.REJECT_PRIMER_ACCEPT_CAPTION).click()
      .screenshot(driver, logDir, 'RejectPrimerDismissed')
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/AddingInvoice_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/AddingInvoice_mocha");
      });
  });

  it("Archiving Invoice", function () {
    return driver
      //checking added invoice in invoice list
      .waitForElementById(Dictionary.CashProgress.EXPECTED,3000)
      .elementById(Dictionary.InvoiceList.TITLE)
      .elementById('August 2026')
      .elementById('1 upcoming invoices')
      .elementById('ClientName')
      .elementById('$2,000.00')
      .screenshot(driver, logDir, 'InitialArchivingInvoice')
      //enter invoice and mark it as paid
      .elementById('ClientName').click()
      .waitForElementById(Dictionary.InvoiceLeads.NOT_DUE)
      .elementById('$2,000.00')
      .elementById(InvoiceActionItems.InvoiceActionItems.NOT_DUE_Title.replace('BILLING_CONTACT_NAME', 'ContactName'))
      .elementById(Dictionary.InvoiceDetails.MARK_AS_DONE)
      .elementById(Dictionary.InvoiceDetails.MARK_AS_PAID)
      .elementById(Dictionary.InvoiceDetails.YES).click()
      //will be dismissed in several seconds, so need to be checked first
      .elementById(Dictionary.InvoiceDetails.MARKED_AS_PAID)
      .screenshot(driver, logDir, 'AfterInvoicePaid')
      .elementById(Dictionary.InvoiceLeads.PAID)
      .elementById('ClientName'+Dictionary.InvoiceDetails.CLIENT_INVOICE_IS+''+Dictionary.DueDays.PAID)
      .elementById(InvoiceActionItems.InvoiceActionItems.PAID_Title.replace('BILLING_CONTACT_NAME','ContactName'))
      .elementById(InvoiceActionItems.InvoiceActionItems.PAID_description)
      .elementById(Dictionary.InvoiceDetails.MARK_AS_ARCHIVED)
      .elementById(Dictionary.InvoiceDetails.YES).click()
      .screenshot(driver, logDir, 'ArchivingAlert')
      .elementById(Dictionary.InvoiceDetails.ARCHIVE_INVOICE_ALERT_TITLE)
      .elementById(Dictionary.InvoiceDetails.ARCHIVE_INVOICE_ALERT_TEXT)
      .elementById(Dictionary.InvoiceDetails.DELETE_INVOICE_REJECT_CAPTION)
      .elementById(Dictionary.InvoiceDetails.ARCHIVE_INVOICE_ACCEPT_CAPTION)
      //tapping 'archive it' button
      .swipe({ startX: 310, startY: 425,endX: 315,  endY: 425, duration: 500 })
      .elementById(Dictionary.InvoiceDetails.MARKED_AS_ARCHIVED)
      .screenshot(driver, logDir, 'InvoiceListAfterArchived')
      .elementById(Dictionary.InvoiceList.TITLE)
      .elementById(Dictionary.InvoiceList.WELL_HELP)
      .elementById(Dictionary.InvoiceList.ADD_YOUR_INVOICES)
      .elementById(Dictionary.InvoiceList.INSTRUCTION_BUTTON)
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/ArchivingInvoice_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/ArchivingInvoice_mocha");
      });
  });

  it("Unarchiving Invoice", function () {
    return driver
      .elementByXPath('//UIAApplication[1]/UIAWindow[1]/UIAElement[1]').click()
      .screenshot(driver, logDir, 'SettingsOptions')
      .elementById(Dictionary.InvoiceList.ENABLE_PUSH_NOTIFICATIONS)
      .elementById(Dictionary.InvoiceList.ABOUT)
      .elementById(Dictionary.InvoiceList.HOW_IT_WORKS)
      .elementById(Dictionary.InvoiceList.EMAIL_SUPPORT)
      .elementById(Dictionary.InvoiceList.LOG_OUT)
      .elementById(Dictionary.InvoiceList.ARCHIVE_LIST)
      //clicking 'Invoice archive'
      .swipe({ startX: 120, startY: 270,endX: 125,  endY: 270, duration: 500 })
      .screenshot(driver, logDir, 'ArchivedInvoice')
      .elementById('$2,000.00')
      .elementById(Dictionary.DueDays.PAID)
      .elementById('ClientName').click()
      .screenshot(driver, logDir, 'UnarchivePage')
      .elementById(Dictionary.InvoiceLeads.PAID)
      .elementById('ClientName'+Dictionary.InvoiceDetails.CLIENT_INVOICE_IS+''+Dictionary.DueDays.PAID)
      .elementById(InvoiceActionItems.InvoiceActionItems.PAID_Title.replace('BILLING_CONTACT_NAME','ContactName'))
      .elementById(InvoiceActionItems.InvoiceActionItems.PAID_description)
      .elementById(Dictionary.InvoiceDetails.UNMARK_AS_ARCHIVED)
      .elementById(Dictionary.InvoiceDetails.YES).click()
      .screenshot(driver, logDir, 'UnarchivedAlert')
      .elementById(Dictionary.InvoiceDetails.UNARCHIVE_INVOICE_ALERT_TITLE)
      .elementById(Dictionary.InvoiceDetails.UNARCHIVE_INVOICE_ALERT_TEXT)
      .elementById(Dictionary.InvoiceDetails.UNARCHIVE_INVOICE_REJECT_CAPTION)
      .elementById(Dictionary.InvoiceDetails.UNARCHIVE_INVOICE_ACCEPT_CAPTION)
      //clicking 'Unarchive it'
      .swipe({ startX: 290, startY: 425,endX: 295,  endY: 425, duration: 500 })
      .screenshot(driver, logDir, 'EmptyArchiveInvoiceList')
      .elementById(Dictionary.InvoiceArchiveList.TITLE)
      .elementById(Dictionary.InvoiceArchiveList.NO_INVOICE_ARCHIVED)
      .elementById(Dictionary.InvoiceArchiveList.CLEAR_SPACE)
      .elementByXPath('//UIAApplication[1]/UIAWindow[1]/UIAElement[1]').click()
      .screenshot(driver, logDir, 'InvoiceListAfterUnarchived')
      .waitForElementById(Dictionary.CashProgress.EXPECTED,3000)
      .elementById(Dictionary.InvoiceList.TITLE)
      .elementById('August 2026')
      .elementById('0 upcoming invoices')
      .elementById('ClientName')
      .elementById('$2,000.00')
      .elementById(Dictionary.DueDays.PAID)
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/UnarchivingInvoice_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/UnarchivingInvoice_mocha");
      });
  })

  it("Deleting Invoice", function () {
    return driver
      //checking added invoice in invoice list
      .waitForElementById(Dictionary.CashProgress.EXPECTED,3000)
      .elementById(Dictionary.InvoiceList.TITLE)
      .elementById('August 2026')
      .elementById('0 upcoming invoices')
      .elementById('ClientName')
      .elementById('$2,000.00')
      .screenshot(driver, logDir, 'InitialDeletingInvoice')
      //enter invoice and delete it
      .elementById('ClientName').click()
      .waitForElementById(Dictionary.InvoiceLeads.PAID)
      .elementById('$2,000.00')
      .elementById(InvoiceActionItems.InvoiceActionItems.PAID_Title.replace('BILLING_CONTACT_NAME', 'ContactName'))
      .elementById(Dictionary.InvoiceDetails.MARK_AS_DONE)
      .elementById(Dictionary.InvoiceDetails.MARK_AS_ARCHIVED)
      .elementById(Dictionary.InvoiceDetails.YES)
      .screenshot(driver, logDir, 'InitialInvoiceDetails')
      .elementByXPath('//UIAApplication[1]/UIAWindow[1]/UIAElement[2]').click()
      .screenshot(driver, logDir, 'BeforeDeletingInvoice')
      .elementById(Dictionary.InvoiceDetails.EDIT_LABEL)
      .elementById(Dictionary.InvoiceDetails.DELETE_LABEL).click()
      .screenshot(driver, logDir, 'DeleteInvoiceAlert')
      .elementById(Dictionary.InvoiceDetails.DELETE_INVOICE_ALERT_TITLE)
      .elementById(Dictionary.InvoiceDetails.DELETE_INVOICE_ALERT_TEXT)
      .elementById(Dictionary.InvoiceDetails.DELETE_INVOICE_REJECT_CAPTION)
      .elementById(Dictionary.InvoiceDetails.DELETE_INVOICE_ACCEPT_CAPTION)
      //tapping 'delete it' button
      .swipe({ startX: 310, startY: 420,endX: 315,  endY: 420, duration: 500 })
      .screenshot(driver, logDir, 'AfterDeletingInvoice')
      .elementById(Dictionary.InvoiceList.TITLE)
      .elementById(Dictionary.InvoiceList.WELL_HELP)
      .elementById(Dictionary.InvoiceList.ADD_YOUR_INVOICES)
      .elementById(Dictionary.InvoiceList.INSTRUCTION_BUTTON)
      .elementByXPath('//UIAApplication[1]/UIAWindow[1]/UIAElement[2]')
      .then(function (){
        return logger.copyFile(appiumLogFile, logDir+"/DeletingInvoice_appium");
      })
      .then(function (){
        return logger.copyFile(mochaLogFile, logDir+"/DeletingInvoice_mocha");
      });
  });
});
