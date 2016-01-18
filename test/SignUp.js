"use strict";

require("./helpers/setup");

var wd = require("wd"),
    _ = require('underscore'),
    actions = require("./helpers/actions"),
    serverConfigs = require('./helpers/appium-servers');


wd.addPromiseChainMethod('swipe', actions.swipe);
wd.addPromiseChainMethod('pinch', actions.pinch);
wd.addPromiseChainMethod('tapping', actions.tapping);
wd.addElementPromiseChainMethod('pinch',
  function () { return this.browser.pinch(this); });
wd.addPromiseChainMethod('zoom', actions.zoom);
wd.addElementPromiseChainMethod('zoom',
  function () { return this.browser.zoom(this); });

describe("ios actions", function () {
  this.timeout(300000);
  var driver;
  var allPassed = true;

  before(function () {
    var serverConfig = serverConfigs.local;
    driver = wd.promiseChainRemote(serverConfig);
    require("./helpers/logging").configure(driver);

    var desired = _.clone(require("./helpers/caps").ios81);
    desired.app = require("./helpers/apps").PWCApp;
    return driver.init(desired);
  });

  after(function () {
    return driver
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

  it("should go through onboard sheets", function () {
    driver.waitForElementById('Let\\\'s start');
    return driver
      .elementById('Let\\\'s start')
      .then(function (el) {
        return driver.tapping(el);
      })
      //.swipe({ startX: 89.5, startY: 454.25,endX: 99.5,  endY: 454.25, duration: 500 })
      .waitForElementById('OnboardingInvoices')
      .elementByXPath('//UIAApplication[1]/UIAWindow[1]/UIAElement[2]').click()
      .waitForElementById('When it\\\'s time to get paid, we\\\'ll remind you.')
      .waitForElementById('OnboardingReminders')
      .swipe({ startX: 300, startY: 200,endX: 50,  endY: 200, duration: 500 })
      //.elementByXPath('//UIAApplication[1]/UIAWindow[1]/UIAElement[2]').click()
      .sleep(1000)
      .waitForElementById('We\\\'ll walk you through the best way to reach out to your client. Good payments make good relationships.')
      .waitForElementById('OnboardingRecommendations')
      .elementById('Sign up').click()
      .sleep(1000);
  });

  it("should go through Compliance 1", function () {
    //step 1 of 5
    driver.sleep(1000);
    var el;
    return driver
      .elementsByClassName('UIATextField')
      // type something
      .then(function (els) {
          return els[0]
            .sendKeys('Morgan')
            .getValue().should.become('Morgan')
      })
      .swipe({ startX: 20, startY: 20,endX: 30,  endY: 20, duration: 500 })
      .sleep(500)
      .elementsByClassName('UIATextField')
      // type something
      .then(function (els) {
          return els[1]
            .sendKeys('MorganAddress')
            .getValue().should.become('MorganAddress')
      })
      .swipe({ startX: 20, startY: 20,endX: 30,  endY: 20, duration: 500 })
      .sleep(500)
      .elementsByClassName('UIATextField')
      // type something
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
      .elementByClassName('UIAPickerWheel')
      .then(function (el) {
          return el
            .sendKeys('CA')
            .getValue().should.become('CA')
      })
      .sleep(500)
      .elementById('Done').click()
      .sleep(500)
      .elementById('Create profile').click()
      .sleep(1000);
  });

  it("should go through Compliance 2", function () {
    //step 2 of 5
    return driver
      .waitForElementById('STEP 2 of 5')
      .elementById('The Right Fit')
      .elementById('Answer a few questions to make sure you belong in our community of small businesses.')
      .elementById('How many employees do you have?')
      .then(function () {
        var action = new wd.TouchAction(driver);
        action
          //taping "just one" button
          .tap({x: 100, y: 340})
          .release();
        return driver.performTouchAction(action);
      })
      .sleep(1000);

  });

  it("should go through Compliance 3", function () {
    //step 3 of 5
      return driver
      .waitForElementById('STEP 3 of 5')
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
      .sleep(2000)
      .then(function () {
        var action = new wd.TouchAction(driver);
        action
          //uncheck button
          .tap({x: 100, y: 350})
          .release();
        return driver.performTouchAction(action);
      })
      .sleep(500)
      .elementById('Continue').click()
      .sleep(500);

  });

  it("should go through Compliance 4", function () {
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
      .sleep(2000)
      .then(function () {
        var action = new wd.TouchAction(driver);
        action
          //uncheck button
          .tap({x: 100, y: 350})
          .release();
        return driver.performTouchAction(action);
      })
      .sleep(500)
      .elementById('Continue').click()
      .sleep(1000);
  });


  it("should go through Compliance 5", function () {
    //step 5 of 5
      return driver
      .waitForElementById('STEP 5 of 5')
      .elementById('One last thing.')
      .elementById('We take accuracy seriously. Help us confirm  your infomation by tapping it below.')
      .waitForElementById('Continue').click()
      .sleep(1000);
    });

    it("should go through Sign up", function () {
      //step 5 of 5
        return driver
        .waitForElementById('You\'re in! Create your account credentials.')
        .elementById('Thanks so much for joining the Business OS community.')
        .elementsByClassName('UIATextField')
        // type something
        .then(function (els) {
            return els[0]
              .sendKeys('JSautotest@pwc.com')
              .getValue().should.become('JSautotest@pwc.com');
        })
        .swipe({ startX: 20, startY: 20,endX: 30,  endY: 20, duration: 500 })
        .elementsByClassName('UIASecureTextField')
        // type something
        .then(function (els) {
            return els[0]
              .sendKeys('JSau/1j.');
        })
        .swipe({ startX: 20, startY: 20,endX: 30,  endY: 20, duration: 500 })
        .waitForElementById('FINISH UP').click()
        .sleep(1000);
        //validate page after successful sign up
    });

});
